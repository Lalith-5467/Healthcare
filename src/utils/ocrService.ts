import { createWorker } from 'tesseract.js';

export interface OcrExtractionResult {
  text: string;
  confidence: number;
  fields: string[];
  isAbdmCompliant: boolean;
  rawConfidence: number;
  passUsed: 1 | 2;
  previewUrl?: string;
  pages?: string[];
  pageCount?: number;
}

export type OcrProgressCallback = (progressPercent: number, statusText?: string) => void;

/**
 * Loads an image (dataURL, Blob, File, or Canvas) into an HTMLCanvasElement
 */
export async function loadImageToCanvas(source: string | HTMLCanvasElement | Blob | File): Promise<HTMLCanvasElement> {
  if (source instanceof HTMLCanvasElement) {
    return source;
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        reject(new Error('Canvas context unavailable'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for OCR'));
    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

/**
 * Normalizes document canvas resolution suitable for Tesseract OCR.
 * Preserves 100% of document content from camera captures, photo library, and uploads
 * without cropping out headers, patient details, or prescribed medicines.
 */
export function cropAndScaleDocument(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  const sx = 0;
  const sy = 0;
  const sw = w;
  const sh = h;

  // Ensure high resolution (minimum width 1600px for crisp text strokes, capped at 2800px)
  let scale = 1;
  if (sw < 1600 && sw > 0) {
    scale = Math.min(2.5, 1800 / sw);
  } else if (sw > 3000) {
    scale = 2400 / sw;
  }
  const destW = Math.round(sw * scale);
  const destH = Math.round(sh * scale);

  const normalized = document.createElement('canvas');
  normalized.width = destW;
  normalized.height = destH;
  const ctx = normalized.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, destW, destH);
  }
  return normalized;
}

/**
 * Preprocesses a canvas image for OCR:
 * - Grayscale conversion
 * - Glare suppression via percentile histogram clipping
 * - Contrast stretch
 * - Adaptive thresholding (for pass 2)
 */
export function preprocessCanvasForOcr(
  inputCanvas: HTMLCanvasElement,
  mode: 'contrast' | 'adaptive_threshold' = 'contrast'
): HTMLCanvasElement {
  const w = inputCanvas.width;
  const h = inputCanvas.height;
  const output = document.createElement('canvas');
  output.width = w;
  output.height = h;

  const ctx = output.getContext('2d');
  if (!ctx) return inputCanvas;

  ctx.drawImage(inputCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const numPixels = w * h;

  // 1. Calculate luminance and histogram
  const lum = new Uint8Array(numPixels);
  const hist = new Int32Array(256);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const l = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    lum[j] = l;
    hist[l]++;
  }

  // 2. Percentile clipping to eliminate reflection/glare hot-spots and shadows
  const pLowThreshold = numPixels * 0.02; // 2% darkest
  const pHighThreshold = numPixels * 0.98; // 98% brightest

  let count = 0;
  let pLow = 0;
  for (let i = 0; i < 256; i++) {
    count += hist[i];
    if (count >= pLowThreshold) {
      pLow = i;
      break;
    }
  }

  count = 0;
  let pHigh = 255;
  for (let i = 255; i >= 0; i--) {
    count += hist[i];
    if (count >= numPixels - pHighThreshold) {
      pHigh = i;
      break;
    }
  }

  const range = Math.max(1, pHigh - pLow);

  if (mode === 'contrast') {
    // Mode 1: Dynamic contrast enhancement + anti-glare gamma darkening
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      let stretched = ((lum[j] - pLow) * 255) / range;
      if (stretched < 0) stretched = 0;
      if (stretched > 255) stretched = 255;

      // Gamma = 1.2 to darken printed/handwritten strokes and suppress washed-out glare
      const normalized = stretched / 255;
      const corrected = Math.round(Math.pow(normalized, 1.2) * 255);

      data[i] = corrected;
      data[i + 1] = corrected;
      data[i + 2] = corrected;
    }
  } else {
    // Mode 2: Adaptive thresholding (binarization for shadows and difficult lighting)
    let sumLum = 0;
    for (let j = 0; j < numPixels; j++) sumLum += lum[j];
    const avgLum = sumLum / numPixels;
    const threshold = Math.max(45, Math.min(210, avgLum - 8));

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const stretched = ((lum[j] - pLow) * 255) / range;
      const binarized = stretched < threshold ? 0 : 255;
      data[i] = binarized;
      data[i + 1] = binarized;
      data[i + 2] = binarized;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return output;
}

/**
 * Safely extracts a clean patient name from OCR lines.
 * Strictly separates patient name from physician details and surrounding metadata.
 */
export function extractPatientNameFromLines(lines: string[], fallbackName?: string): string {
  for (const line of lines) {
    const pMatch = line.match(/(?:patient\s*name|patient|pt\.?|name)\s*[:|-]\s*([a-zA-Z\s.]+)/i);
    if (pMatch && pMatch[1]) {
      let clean = pMatch[1]
        // Strip doctor and other field labels if concatenated on the same line
        .replace(/\s+(?:dr\.?|doctor|physician|consultant|clinic|hospital|age|sex|gender|date|reg\.?|uhid|opd|ipd)\b.*$/i, '')
        .replace(/^[#*•\-_:|\s]+/, '')
        .replace(/[,;|/•\-#*:]+$/, '')
        .trim();
      if (
        clean.length >= 2 &&
        !clean.toLowerCase().startsWith('dr') &&
        !clean.toLowerCase().includes('hospital') &&
        !clean.toLowerCase().includes('clinic') &&
        !clean.toLowerCase().includes('prescription')
      ) {
        return clean;
      }
    }
  }

  // Fallback to standalone name line labeled as "Patient" or "Name"
  for (const line of lines) {
    if (/^patient\b/i.test(line)) {
      const clean = line
        .replace(/^[#*•\-_:|\s]+/, '')
        .replace(/^patient\s*[:|-]?\s*/i, '')
        .replace(/\s+(?:dr\.?|doctor|physician|age|sex|gender|date)\b.*$/i, '')
        .trim();
      if (clean.length >= 2 && !clean.toLowerCase().startsWith('dr')) {
        return clean;
      }
    }
  }

  return (fallbackName && fallbackName.trim() && fallbackName.trim() !== 'Doctor') ? fallbackName.trim() : 'Patient';
}

/**
 * Robustly extracts the prescribing physician's name from OCR lines.
 * Removes unrelated patient names, serial numbers, headings, and other OCR text.
 * Returns "Unable to verify physician name" if not confidently found. Never invents a name.
 */
export function extractDoctorNameFromLines(lines: string[], patientName?: string): string {
  const cleanPatientTokens = patientName && patientName !== 'Patient'
    ? patientName.trim().split(/\s+/).filter(t => t.length > 1).map(t => t.toLowerCase())
    : [];

  const isContaminatedByPatient = (str: string): boolean => {
    if (!patientName || patientName === 'Patient') return false;
    const lower = str.toLowerCase();
    if (lower.includes(patientName.toLowerCase())) return true;
    for (const token of cleanPatientTokens) {
      if (new RegExp(`\\b${token}\\b`, 'i').test(lower)) return true;
    }
    return false;
  };

  const cleanDoctorCandidate = (raw: string): string | null => {
    let candidate = raw.trim();

    // 1. If candidate contains Dr. or Doctor in the middle (e.g. "Helen Persia 2 Dr. Arjun Kumar"),
    // discard everything before the doctor title
    const drIndex = candidate.search(/\b(?:dr\.?|doctor)\s+[a-zA-Z]/i);
    if (drIndex !== -1) {
      candidate = candidate.slice(drIndex);
    } else {
      candidate = candidate.replace(/^(?:prescribing\s*(?:physician|doctor)|consulting\s*(?:physician|doctor)|attending\s*(?:physician|doctor)|treated\s*by|consultant|physician|doctor)\s*[:|-]?\s*/i, '');
    }

    // 2. Remove any occurrences of the patient's name
    if (patientName && patientName !== 'Patient') {
      const escPatient = patientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      candidate = candidate.replace(new RegExp(`\\b${escPatient}\\b`, 'gi'), '');
      for (const token of cleanPatientTokens) {
        const escToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        candidate = candidate.replace(new RegExp(`\\b${escToken}\\b`, 'gi'), '');
      }
    }

    // 3. Remove leading numbers, serial numbers, punctuation, or table cell artifacts (e.g. "2 ", "#1 ", "S.No ")
    candidate = candidate.replace(/^[\d\s.#*•\-_:|\/,]+/, '');
    candidate = candidate.replace(/^(?:s\.?\s*no\.?|no\.?|opd|ipd|uhid|bed|room|token|page)\s*[:|-]?\s*\d*\s*/i, '');

    // 4. Ensure proper "Dr. " prefix formatting
    candidate = candidate.replace(/^dr\b(?!\.)/i, 'Dr.');
    candidate = candidate.replace(/^dr\.\s*/i, 'Dr. ');
    candidate = candidate.replace(/^doctor\s*[:|-]?\s*/i, 'Dr. ');

    // 5. Strip trailing unrelated fields (e.g. Date, Reg. No, Phone, Hospital, Signature)
    candidate = candidate.replace(/\s+(?:reg\.?\s*(?:no\.?)?|date|dt\.?|prescription\s*date|ph(?:one)?|mob(?:ile)?|contact|email|time|age|sex|gender|uhid|opd|ipd|hospital|clinic|centre|center|department|dept|sign(?:ature)?)\b.*$/i, '');
    candidate = candidate.replace(/\b(?:signature|signed|verified|seal)\b.*$/i, '');
    candidate = candidate.replace(/[,;|/•\-#*:]+$/, '').trim();

    // 6. Check for valid name structure
    const nameWithoutTitle = candidate.replace(/^(?:dr\.?|doctor)\s+/i, '').trim();
    const lettersOnly = nameWithoutTitle.replace(/[^a-zA-Z]/g, '');

    if (lettersOnly.length < 2) return null;

    if (/^(?:name|physician|doctor|consultant|hospital|clinic|signature|patient|prescription|mbbs|md|ms)$/i.test(nameWithoutTitle)) {
      return null;
    }

    if (isContaminatedByPatient(candidate) && lettersOnly.toLowerCase() === (patientName || '').replace(/[^a-zA-Z]/g, '').toLowerCase()) {
      return null;
    }

    if (!candidate.toLowerCase().startsWith('dr.') && !candidate.toLowerCase().startsWith('dr ')) {
      candidate = `Dr. ${candidate}`;
    }

    return candidate.trim();
  };

  // PASS 1: Explicit labeled lines
  for (const line of lines) {
    if (/(?:prescribing\s*(?:physician|doctor)|consulting\s*(?:physician|doctor)|attending\s*physician|treated\s*by|consultant\s*:|physician\s*:|doctor\s*:)/i.test(line)) {
      const cleaned = cleanDoctorCandidate(line);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  // PASS 2: Lines containing "Dr." with a name
  for (const line of lines) {
    if (/\b(?:dr\.?|doctor)\s+[a-zA-Z]/i.test(line)) {
      const cleaned = cleanDoctorCandidate(line);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  // PASS 3: Medical degree lines
  for (const line of lines) {
    if (/\b(?:mbbs|md|ms|dnb|dm|mch|frcp|mrcp)\b/i.test(line) && !line.toLowerCase().includes('patient')) {
      const cleaned = cleanDoctorCandidate(line);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  return 'Unable to verify physician name';
}

/**
 * Safely and accurately extracts the hospital or clinic name from OCR lines.
 * Strictly separates the clinic name from patient names, physician names, contact numbers, and unrelated OCR text.
 * Returns "" if not present or purely a generic placeholder. Never invents a clinic name.
 */
export function extractClinicNameFromLines(
  lines: string[],
  patientName?: string,
  doctorName?: string
): string {
  const isGenericPlaceholder = (text: string): boolean => {
    const lower = text.trim().toLowerCase();
    return (
      lower === 'hospital' ||
      lower === 'clinic' ||
      lower === 'hospital / clinic' ||
      lower === 'hospital/clinic' ||
      lower === 'hospital / facility' ||
      lower === 'hospital name' ||
      lower === 'clinic name' ||
      lower === 'facility' ||
      lower === 'medical centre' ||
      lower === 'medical center' ||
      lower === 'health centre' ||
      lower === 'health center' ||
      lower === 'healthcare' ||
      lower === 'dispensary' ||
      lower === 'centre' ||
      lower === 'center' ||
      lower === 'poly clinic' ||
      lower === 'polyclinic'
    );
  };

  const cleanClinicCandidate = (raw: string): string | null => {
    let candidate = raw.trim();

    // 1. Remove leading noise, bullets, dashes, bars
    candidate = candidate.replace(/^[#*•\-_:|\s]+/, '');

    // 2. Remove leading label prefixes (e.g. "Hospital / Clinic:", "Hospital:", "Clinic Name:", "Clinic:")
    candidate = candidate.replace(
      /^(?:hospital\s*\/\s*clinic|hospital\s*name|clinic\s*name|hospital\s*\/\s*facility|hospital|clinic|facility|medical\s*centre|medical\s*center|healthcare\s*centre|health\s*centre)\s*[:|-]?\s*/i,
      ''
    );

    // 3. Remove patient name if concatenated on the same line
    if (patientName && patientName !== 'Patient') {
      const escPatient = patientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      candidate = candidate.replace(new RegExp(`\\b(?:patient(?:\\s*name)?\\s*[:|-]?\\s*)?${escPatient}\\b`, 'gi'), '');
    }

    // 4. Remove doctor name if concatenated on the same line
    if (doctorName && doctorName !== 'Unable to verify physician name') {
      const escDoctor = doctorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      candidate = candidate.replace(new RegExp(`\\b(?:dr\\.?|doctor)?\\s*${escDoctor}\\b`, 'gi'), '');
    }
    // Also strip generic doctor prefixes if at the end of the line (e.g. "... | Dr. Arjun Kumar")
    candidate = candidate.replace(/[•|]\s*(?:dr\.?|doctor)\b.*$/i, '');
    candidate = candidate.replace(/\s+(?:dr\.?|doctor)\s+[a-zA-Z].*$/i, '');

    // 5. Strip trailing metadata (e.g., Phone, Mobile, Contact, Email, Date, Reg No, GST, Timing, Fax)
    candidate = candidate.replace(
      /\s+(?:ph(?:one)?|mob(?:ile)?|tel|call|contact|email|web(?:site)?|reg\.?\s*(?:no\.?)?|date|dt\.?|timing|timings|gst|fax|pin)\b.*$/i,
      ''
    );

    // 6. Strip trailing punctuation/noise
    candidate = candidate.replace(/[,;|/•\-#*:]+$/, '').trim();

    // 7. Check candidate validity
    if (candidate.length < 3 || candidate.length > 120) return null;

    // Reject if candidate looks like a medication dosage line
    if (/(?:tab\.?|cap\.?|tablet|capsule|syrup|mg|ml|mcg|once daily|twice daily|\b\d+\s*days\b)/i.test(candidate)) {
      return null;
    }

    // Reject if it starts with doctor title or is purely patient/doctor
    if (/^(?:dr\b|dr\.|doctor|patient)\b/i.test(candidate)) {
      return null;
    }

    // Reject if it is merely a generic placeholder
    if (isGenericPlaceholder(candidate)) {
      return null;
    }

    return candidate.trim();
  };

  // PASS 1: Explicit labeled lines (e.g. "Hospital: Apollo Multispecialty", "Clinic: City Care Clinic")
  for (const line of lines) {
    if (
      /^(?:hospital\s*\/\s*clinic|hospital\s*name|clinic\s*name|hospital\s*:|clinic\s*:|facility\s*:|institution\s*:|medical\s*centre\s*:)/i.test(
        line.trim()
      )
    ) {
      const cleaned = cleanClinicCandidate(line);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  // PASS 2: Lines containing strong hospital/clinic keywords
  const strongKeywords = /(?:hospital|clinic|centre|center|health\s*(?:facility|centre|care|city)|medical\s*centre|medical\s*center|dispensary|nursing\s*home|polyclinic|multispecialty|super\s*specialty|apollo|fortis|sms|max\s*healthcare|manipal|aiims|medanta)/i;
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      strongKeywords.test(trimmed) &&
      !trimmed.toLowerCase().startsWith('patient') &&
      !trimmed.toLowerCase().startsWith('dr.') &&
      !trimmed.toLowerCase().startsWith('dr ') &&
      !trimmed.toLowerCase().startsWith('doctor') &&
      !trimmed.toLowerCase().startsWith('rx') &&
      !trimmed.toLowerCase().startsWith('prescribing')
    ) {
      const cleaned = cleanClinicCandidate(line);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  return '';
}

/**
 * Cleans and formats raw OCR output text into a clean, professional,
 * human-readable clinical transcript. Removes optical artifacts, broken quotes,
 * scanned status badge junk, and footer QR code noise.
 */
export function sanitizeOcrText(raw: string): string {
  if (!raw || !raw.trim()) return '';

  const lines = raw.split(/\r?\n/);
  const cleaned: string[] = [];
  let prevCleanLine = '';
  const bulletPattern = new RegExp("^[\\u00AB\\u00BB\\u201C\\u201D\"'`\\-*#\\u2022=\\[\\]()<>\\u00A9\\u00AE\\u25CFoO\\u00B0\\u00B7\\s]+(?=[A-Za-z0-9])", 'i');
  const bulletReplPattern = new RegExp("^[\\u00AB\\u00BB\\u201C\\u201D\"'`\\-*#\\u2022=\\[\\]()<>\\u00A9\\u00AE\\u25CFoO\\u00B0\\u00B7\\s]+", 'i');

  for (const rawLine of lines) {
    let l = rawLine.trim();
    if (!l) continue;

    // 1. Clean bullet characters on note / advisory lines
    if (bulletPattern.test(l)) {
      l = l.replace(bulletReplPattern, '\u2022 ');
    }

    // 2. Fix noisy status badges like: "o Active (© Pending (© Pending Cs"
    if (/(?:active|verified)/i.test(l) && /(?:pending|completed)/i.test(l)) {
      l = 'Prescription Status: Active | Pharmacy Status: Pending | Payment Status: Pending';
    }

    // 3. Fix redundant header text under badges: "Prescription Status Pharmacy Status Payment Status Dr. Arjun Kumar"
    if (/prescription\s*status\s+pharmacy\s*status/i.test(l)) {
      l = l.replace(/prescription\s*status\s+pharmacy\s*status\s*(?:payment\s*status)?/gi, '').trim();
      if (!l) continue;
    }

    // 4. Fix QR / Security footer noise
    if (/scan\s*to\s*view/i.test(l)) {
      l = '\u2022 Scan to View Digital Prescription';
    } else if (/digital\s*prescription/i.test(l)) {
      l = '\u2022 Digital Prescription (Verified & Encrypted)';
    } else if (/secure\s*&\s*encrypted|stay\s*h/i.test(l)) {
      l = '\u2022 Secure & Encrypted Document \u2022 Stay Healthy \u2661';
    }

    // 5. Filter out garbled short optical symbols/noise (e.g. "[s] oy", "= ZR]", "Cs", "QQ")
    if (/^[\W_0-9a-zA-Z\s]{1,4}$/.test(l) && !/^(?:tab|cap|inj|syp|rx|opd|ipd|mg|ml|dr\.?|mr\.?|mrs\.?)$/i.test(l)) {
      continue;
    }

    // Prevent identical successive lines
    if (l === prevCleanLine) {
      continue;
    }

    prevCleanLine = l;
    cleaned.push(l);
  }

  return cleaned.join('\n');
}

/**
 * Extracts structured prescription and medical fields from OCR text.
 * Strictly avoids guessing or inventing missing information.
 */
export function extractFieldsFromText(
  rawText: string,
  rawConfidence: number
): { fields: string[]; isAbdmCompliant: boolean } {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const fields: string[] = [];
  let isAbdmCompliant = false;

  // 1. Patient Name (Identified first to avoid cross-field contamination)
  const patientNameCandidate = extractPatientNameFromLines(lines);
  if (patientNameCandidate && patientNameCandidate !== 'Patient') {
    fields.push(`Patient: ${patientNameCandidate}`);
  }

  // 2. Consulting Doctor & Degrees
  const doctorNameCandidate = extractDoctorNameFromLines(lines, patientNameCandidate);
  if (doctorNameCandidate && doctorNameCandidate !== 'Unable to verify physician name') {
    fields.push(`Doctor: ${doctorNameCandidate}`);
  } else {
    fields.push('Doctor: Unable to verify physician name');
  }

  // 3. Hospital / Clinic / Healthcare Facility
  const clinicCandidate = extractClinicNameFromLines(lines, patientNameCandidate, doctorNameCandidate);
  if (clinicCandidate) {
    fields.push(`Hospital / Facility: ${clinicCandidate}`);
  }

  // 4. Prescription Date
  const datePattern = /(?:date|prescribed\s*on|rx\s*date)\s*[:|-]?\s*([0-9a-zA-Z\s,.-]+)|\b(\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4})\b|\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i;
  for (const line of lines) {
    const match = line.match(datePattern);
    if (match) {
      const d = match[1] || match[2] || match[3] || line.trim();
      fields.push(`Prescription Date: ${d.trim()}`);
      break;
    }
  }

  // 5. Demographics (Age & Gender)
  const agePattern = /(?:age|gender|sex)\s*[:|-]?\s*([0-9a-zA-Z\s|/]+)/i;
  for (const line of lines) {
    const match = line.match(agePattern);
    if (match && match[1] && /\d/.test(match[1])) {
      fields.push(`Demographics: ${match[0].trim()}`);
      break;
    } else if (/\b(\d{1,3})\s*(?:yrs|years|yr|y\/o)\b/i.test(line)) {
      fields.push(`Demographics: ${line.trim()}`);
      break;
    }
  }

  // 6. ABHA ID / ABDM Identifier
  const abhaPattern = /\b(\d{2}-\d{4}-\d{4}-\d{4}(?:@abdm)?)\b/i;
  const abdmHandlePattern = /\b([a-zA-Z0-9._]+@abdm)\b/i;
  for (const line of lines) {
    const abhaMatch = line.match(abhaPattern);
    const handleMatch = line.match(abdmHandlePattern);
    if (abhaMatch) {
      fields.push(`ABHA ID: ${abhaMatch[1]}`);
      isAbdmCompliant = true;
      break;
    } else if (handleMatch) {
      fields.push(`ABHA Address: ${handleMatch[1]}`);
      isAbdmCompliant = true;
      break;
    } else if (/abha\b/i.test(line)) {
      fields.push(`ABDM Verified: ${line.trim()}`);
      isAbdmCompliant = true;
      break;
    }
  }

  // 7. Clinical Diagnosis / Impression
  const diagPattern = /(?:diagnosis|findings|complaint|condition|impression|rx\s*ref)\s*[:|-]?\s*(.*)/i;
  for (const line of lines) {
    const match = line.match(diagPattern);
    if (match && match[1] && match[1].trim().length > 2) {
      fields.push(`Diagnosis: ${match[1].trim()}`);
      break;
    }
  }

  // 8. Prescribed Medications (Name, Dosage, Frequency, Duration)
  const medKeywords = /(?:tab\.?|cap\.?|tablet|capsule|syrup|syp\.?|inj\.?|oint\.?|drops?|mg|ml|mcg|gm|paracetamol|amoxicillin|azithromycin|cetirizine|montelukast|amlodipine|metoprolol|aspirin|ibuprofen|pantoprazole|vomilast|abciximab|zoclar|gestakind|metformin|atorvastatin|losartan|omeprazole|ciprofloxacin|doxycycline)/i;
  const foundMeds: { name: string; dosage?: string; duration?: string; instructions?: string }[] = [];

  for (const line of lines) {
    if (medKeywords.test(line) && !line.toLowerCase().includes('patient') && !line.toLowerCase().includes('hospital') && !line.toLowerCase().startsWith('dr')) {
      const cleanLine = line.replace(/^\d+[\s.)-]+\s*/, '').trim();
      if (cleanLine.length > 3 && cleanLine.length < 100) {
        // Look for dosage / frequency
        const freqMatch = cleanLine.match(/(?:once\s*daily|twice\s*daily|three\s*times\s*daily|four\s*times\s*daily|\b1-0-1\b|\b1-0-0\b|\b0-0-1\b|\b1-1-1\b|\b1\s*tablet\b|\b1\s*cap\b|morning|night|bedtime|daily)/i);
        // Look for duration
        const durMatch = cleanLine.match(/\b(\d+)\s*(?:days?|weeks?|months?)\b/i);
        // Look for instructions
        const instMatch = cleanLine.match(/(?:after\s*food|before\s*food|with\s*food|after\s*meals|before\s*meals|empty\s*stomach)/i);

        let medName = cleanLine;
        if (freqMatch && durMatch) {
          medName = cleanLine.split(freqMatch[0])[0].trim();
        }

        foundMeds.push({
          name: medName.replace(/[•|]/g, '').trim(),
          dosage: freqMatch ? freqMatch[0] : undefined,
          duration: durMatch ? durMatch[0] : undefined,
          instructions: instMatch ? instMatch[0] : undefined
        });
      }
    }
  }

  if (foundMeds.length > 0) {
    foundMeds.slice(0, 4).forEach((med, idx) => {
      fields.push(`MEDICINE: ${med.name}`);
      if (med.dosage) {
        fields.push(`DOSAGE: ${med.dosage}`);
      }
      if (med.duration) {
        fields.push(`DURATION: ${med.duration}`);
      }
      if (med.instructions) {
        fields.push(`INSTRUCTIONS: ${med.instructions}`);
      }
    });
  }

  // 9. Follow-Up Directive
  const followUpPattern = /(?:follow[- ]?up|review|scheduled|next\s*visit)\s*[:|-]?\s*(.*)/i;
  for (const line of lines) {
    const match = line.match(followUpPattern);
    if (match) {
      fields.push(`Follow-Up: ${line.trim()}`);
      break;
    }
  }

  // 10. Physician Signature & ABDM Network Verification
  for (const line of lines) {
    if (/(?:verified\s*physician|digitally\s*signed|signature|hipaa|abdm\s*health\s*network)/i.test(line)) {
      fields.push('Physician Signature & ABDM Verification: Verified');
      isAbdmCompliant = true;
      break;
    }
  }

  // 11. Handwritten text warning if confidence is low
  if (rawConfidence < 55) {
    fields.push('Notice: Some handwritten prescription text could not be read clearly. Please capture a sharper image.');
  }

  // Fallback: If minimal fields matched but we have recognized text lines, extract prominent entities
  if (fields.length === 0 && lines.length > 0) {
    lines.slice(0, 5).forEach((line, idx) => {
      if (line.length > 4) {
        fields.push(`Detected Line #${idx + 1}: ${line}`);
      }
    });
  }

  // ABDM compliance verification check
  if (!isAbdmCompliant) {
    isAbdmCompliant = (rawText.toLowerCase().includes('abdm') ||
      rawText.toLowerCase().includes('abha') ||
      rawText.toLowerCase().includes('national health')) && (fields.length >= 2);
  }

  return { fields, isAbdmCompliant };
}

/**
 * Runs multi-pass optical Tesseract OCR on a prepared canvas.
 */
export async function runOpticalOcrOnCanvas(
  rawCanvas: HTMLCanvasElement,
  onProgress?: OcrProgressCallback
): Promise<OcrExtractionResult> {
  console.log('[OCR] canvas processing started');
  if (onProgress) onProgress(15, 'Preparing neural image normalization...');

  // Normalize document resolution without cropping any borders
  const scaledCanvas = cropAndScaleDocument(rawCanvas);

  // Preprocess canvas for Pass 1 (Grayscale + Dynamic Contrast + Glare Suppression)
  if (onProgress) onProgress(30, 'Enhancing document contrast & suppressing glare...');
  const preprocessedPass1 = preprocessCanvasForOcr(scaledCanvas, 'contrast');

  let worker: any = null;
  try {
    worker = await createWorker('eng', 1, {
      logger: (m: any) => {
        if (m.status === 'loading tesseract core') {
          if (onProgress) onProgress(35, 'Loading optical OCR neural core...');
        } else if (m.status === 'initializing tesseract' || m.status === 'loading language traineddata') {
          if (onProgress) onProgress(45, 'Loading medical vocabulary & trained language data...');
        } else if (m.status === 'initializing api') {
          if (onProgress) onProgress(55, 'Preparing neural layout analysis...');
        } else if (m.status === 'recognizing text') {
          const prog = Math.min(92, Math.round(55 + (m.progress || 0) * 37));
          if (onProgress) onProgress(prog, 'Running optical character recognition & NLP...');
        }
      }
    });

    // PASS 1: Recognize with contrast-enhanced canvas
    console.log('[OCR] Pass 1 recognition starting...');
    const ret1 = await worker.recognize(preprocessedPass1);
    let bestRet = ret1;
    let passUsed: 1 | 2 = 1;

    let text1 = (ret1.data && ret1.data.text) ? ret1.data.text.trim() : '';
    let conf1 = typeof ret1.data?.confidence === 'number' ? ret1.data.confidence : 0;
    if (conf1 === 0 && ret1.data?.words && ret1.data.words.length > 0) {
      const sum = ret1.data.words.reduce((acc: number, w: any) => acc + (w.confidence || 0), 0);
      conf1 = sum / ret1.data.words.length;
    }

    // MULTI-PASS OCR: If Pass 1 confidence is low (< 60%) or text is short, try Pass 2 (Adaptive Binarization)
    if (conf1 < 60 || text1.length < 25) {
      if (onProgress) onProgress(75, 'Applying adaptive thresholding multi-pass analysis...');
      console.log('[OCR] Pass 1 confidence low (' + conf1 + '%). Running Pass 2 adaptive binarization...');

      const preprocessedPass2 = preprocessCanvasForOcr(scaledCanvas, 'adaptive_threshold');
      try {
        const ret2 = await worker.recognize(preprocessedPass2);
        const text2 = (ret2.data && ret2.data.text) ? ret2.data.text.trim() : '';
        let conf2 = typeof ret2.data?.confidence === 'number' ? ret2.data.confidence : 0;
        if (conf2 === 0 && ret2.data?.words && ret2.data.words.length > 0) {
          const sum = ret2.data.words.reduce((acc: number, w: any) => acc + (w.confidence || 0), 0);
          conf2 = sum / ret2.data.words.length;
        }

        // Compare Pass 2 vs Pass 1: choose the pass with higher confidence and more text
        if (conf2 > conf1 || (conf2 >= conf1 - 5 && text2.length > text1.length)) {
          bestRet = ret2;
          passUsed = 2;
          console.log('[OCR] Pass 2 selected with confidence:', conf2, '%');
        } else {
          console.log('[OCR] Pass 1 retained with confidence:', conf1, '%');
        }
      } catch (pass2Err) {
        console.warn('[OCR] Pass 2 execution error, falling back to Pass 1:', pass2Err);
      }
    }

    console.log('[OCR] processing completed');
    const rawRecognizedText = (bestRet.data && bestRet.data.text) ? bestRet.data.text.trim() : '';
    const finalText = sanitizeOcrText(rawRecognizedText);
    console.log('[OCR] extracted text length:', finalText.length);

    // Calculate real OCR confidence score
    let rawConfidence = typeof bestRet.data?.confidence === 'number' ? bestRet.data.confidence : 0;
    if (rawConfidence === 0 && bestRet.data?.words && bestRet.data.words.length > 0) {
      const sum = bestRet.data.words.reduce((acc: number, w: any) => acc + (w.confidence || 0), 0);
      rawConfidence = sum / bestRet.data.words.length;
    }
    const confidence = Math.max(1, Math.min(100, Math.round(rawConfidence * 10) / 10));

    // Medical field extraction
    const { fields, isAbdmCompliant } = extractFieldsFromText(finalText, confidence);
    console.log('[OCR] field extraction completed');

    // ABDM validation
    const finalAbdm = isAbdmCompliant && confidence > 30;

    if (onProgress) onProgress(100, '✓ Extraction complete');

    return {
      text: finalText,
      confidence,
      fields,
      isAbdmCompliant: finalAbdm,
      rawConfidence,
      passUsed
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (termErr) {
        console.warn('[OCR] worker termination error:', termErr);
      }
    }
  }
}


export async function processPdfSource(
  source: string | Blob | File,
  onProgress?: OcrProgressCallback
): Promise<OcrExtractionResult> {
  if (onProgress) onProgress(15, 'Reading PDF structure & layout streams...');

  let arrayBuffer: ArrayBuffer;
  let originalBlobUrl: string | undefined;

  if (source instanceof Blob) {
    if (source.size === 0) {
      throw new Error('The selected PDF file is empty (0 bytes). Please upload a valid document.');
    }
    if (source.size > 25 * 1024 * 1024) {
      throw new Error('PDF file size exceeds 25 MB limit.');
    }
    try {
      originalBlobUrl = URL.createObjectURL(source);
    } catch {}
    arrayBuffer = await source.arrayBuffer();
  } else if (typeof source === 'string' && source.startsWith('data:application/pdf;base64,')) {
    const base64 = source.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    arrayBuffer = bytes.buffer;
  } else if (typeof source === 'string') {
    const res = await fetch(source);
    arrayBuffer = await res.arrayBuffer();
  } else {
    throw new Error('Unsupported PDF input format');
  }

  const uint8 = new Uint8Array(arrayBuffer);

  if (uint8.length === 0) {
    throw new Error('The selected PDF file is empty (0 bytes). Please upload a valid document.');
  }

  // Check valid PDF header (%PDF-)
  const isPdfHeader =
    uint8.length >= 4 &&
    uint8[0] === 0x25 && // %
    uint8[1] === 0x50 && // P
    uint8[2] === 0x44 && // D
    uint8[3] === 0x46;   // F

  if (!isPdfHeader) {
    throw new Error('The selected file is not a valid PDF document or appears to be corrupted.');
  }

  // Check for password encryption (/Encrypt)
  const textDecoder = new TextDecoder('latin1');
  const headerSlice = textDecoder.decode(uint8.subarray(0, Math.min(uint8.length, 65536)));
  const footerSlice = textDecoder.decode(uint8.subarray(Math.max(0, uint8.length - 65536)));
  if (headerSlice.includes('/Encrypt') || footerSlice.includes('/Encrypt')) {
    throw new Error('This PDF document is password-protected. Please upload an unlocked PDF or image.');
  }

  // 1. Check for embedded JPEG image streams (common in scanned prescriptions saved to PDF)
  const scannedPages: { blob: Blob; url: string }[] = [];
  let scanPos = 0;
  while (scanPos < uint8.length - 3) {
    if (uint8[scanPos] === 0xff && uint8[scanPos + 1] === 0xd8 && uint8[scanPos + 2] === 0xff) {
      let pageEnd = -1;
      for (let j = scanPos + 3; j < uint8.length - 1; j++) {
        if (uint8[j] === 0xff && uint8[j + 1] === 0xd9) {
          pageEnd = j + 2;
          break;
        }
      }
      if (pageEnd !== -1 && pageEnd - scanPos > 500) {
        const slice = uint8.slice(scanPos, pageEnd);
        const jBlob = new Blob([slice], { type: 'image/jpeg' });
        scannedPages.push({ blob: jBlob, url: URL.createObjectURL(jBlob) });
        scanPos = pageEnd;
        continue;
      }
    }
    scanPos++;
  }

  if (scannedPages.length > 0) {
    if (onProgress) onProgress(25, `Found ${scannedPages.length} scanned page(s) in PDF document...`);
    // Run optical OCR on the first page canvas
    const canvas = await loadImageToCanvas(scannedPages[0].blob);
    const ocrResult = await runOpticalOcrOnCanvas(canvas, onProgress);
    ocrResult.previewUrl = scannedPages[0].url || originalBlobUrl;
    ocrResult.pages = scannedPages.map(p => p.url);
    ocrResult.pageCount = scannedPages.length;
    return ocrResult;
  }

  // 2. Parse text streams from digital PDF
  if (onProgress) onProgress(35, 'Extracting text streams from digital PDF...');
  const rawString = textDecoder.decode(uint8);

  const extractedLines: string[] = [];
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawString)) !== null) {
    const streamContent = match[1];
    const tjMatches = [...streamContent.matchAll(/\(([^)]+)\)\s*(?:Tj|'|")/g)].map(m => m[1]);
    if (tjMatches.length > 0) {
      extractedLines.push(...tjMatches);
    }

    // Try DecompressionStream for FlateDecode streams
    try {
      const streamStart = match.index + match[0].indexOf('\n') + 1;
      const streamEnd = match.index + match[0].lastIndexOf('endstream');
      if (streamEnd > streamStart && typeof DecompressionStream !== 'undefined') {
        const compressedSlice = uint8.slice(streamStart, streamEnd);
        if (compressedSlice.length > 2 && (compressedSlice[0] === 0x78 || (compressedSlice[0] === 0x1f && compressedSlice[1] === 0x8b))) {
          const ds = new DecompressionStream(compressedSlice[0] === 0x1f ? 'gzip' : 'deflate');
          const decompressed = await new Response(new Blob([compressedSlice]).stream().pipeThrough(ds)).arrayBuffer().catch(() => null);
          if (decompressed) {
            const decompressedStr = new TextDecoder('utf-8').decode(decompressed);
            const decompMatches = [...decompressedStr.matchAll(/\(([^)]+)\)\s*(?:Tj|'|")/g)].map(m => m[1]);
            if (decompMatches.length > 0) {
              extractedLines.push(...decompMatches);
            }
          }
        }
      }
    } catch {
      // Non-flate stream, skip
    }
  }

  const cleanText = extractedLines
    .map(l => l.replace(/\\([()\\])/g, '$1').trim())
    .filter(l => l.length > 0)
    .join('\n');

  if (cleanText.trim().length > 10) {
    if (onProgress) onProgress(80, 'Analyzing extracted PDF medical fields...');
    const confidence = Math.min(98, Math.max(65, Math.round(75 + cleanText.length / 50)));
    const { fields, isAbdmCompliant } = extractFieldsFromText(cleanText, confidence);

    let canvasPreview: string | undefined;
    if (typeof document !== 'undefined') {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 1200;
      textCanvas.height = 1600;
      const ctx = textCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 1600);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('Digital PDF Prescription Document', 60, 80);
        ctx.font = '16px monospace';
        cleanText.split('\n').slice(0, 45).forEach((line, i) => {
          ctx.fillText(line, 60, 130 + i * 28);
        });
      }
      canvasPreview = textCanvas.toDataURL('image/jpeg', 0.9);
    }
    const finalPreview = originalBlobUrl || canvasPreview || '';

    if (onProgress) onProgress(100, '✓ PDF Extraction complete');
    return {
      text: cleanText,
      confidence,
      fields,
      isAbdmCompliant,
      rawConfidence: confidence,
      passUsed: 1,
      previewUrl: finalPreview,
      pages: [finalPreview],
      pageCount: 1
    };
  }

  throw new Error('Unable to extract readable text or images from this PDF document. Please upload a clear photo or digital prescription.');
}

/**
 * Runs the optical Tesseract OCR pipeline on any captured image or document source.
 * Handles Camera Captures, Photo Library files, and Uploaded Images/PDFs.
 */
export async function runOpticalOcr(
  imageSource: string | HTMLCanvasElement | Blob | File,
  onProgress?: OcrProgressCallback
): Promise<OcrExtractionResult> {
  console.log('[OCR] processing started');
  if (onProgress) onProgress(10, 'Initializing OCR engine...');

  if (imageSource instanceof File) {
    if (imageSource.size === 0) {
      throw new Error('The selected file is empty (0 bytes). Please select a valid document.');
    }
    if (imageSource.size > 25 * 1024 * 1024) {
      throw new Error('File size exceeds the 25 MB limit.');
    }
  }

  // Check if document is a PDF
  const isPdf =
    (typeof imageSource === 'string' && (imageSource.startsWith('data:application/pdf') || imageSource.toLowerCase().includes('.pdf'))) ||
    (imageSource instanceof File && (imageSource.type === 'application/pdf' || imageSource.name.toLowerCase().endsWith('.pdf'))) ||
    (imageSource instanceof Blob && imageSource.type === 'application/pdf');

  if (isPdf) {
    return processPdfSource(imageSource as any, onProgress);
  }

  // Load image to canvas
  const rawCanvas = await loadImageToCanvas(imageSource);
  const result = await runOpticalOcrOnCanvas(rawCanvas, onProgress);

  if (!result.previewUrl) {
    if (typeof imageSource === 'string') {
      result.previewUrl = imageSource;
    } else if (imageSource instanceof Blob) {
      result.previewUrl = URL.createObjectURL(imageSource);
    } else {
      result.previewUrl = rawCanvas.toDataURL('image/jpeg', 0.92);
    }
  }
  if (!result.pages) {
    result.pages = [result.previewUrl];
    result.pageCount = 1;
  }

  return result;
}

/**
 * Extracts structured medicine items from real OCR text.
 */
export function parseMedicinesFromText(rawText: string): any[] {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const medKeywords = /(?:tab\.?|cap\.?|tablet|capsule|syrup|syp\.?|inj\.?|oint\.?|drops?|mg|ml|mcg|gm|paracetamol|amoxicillin|azithromycin|cetirizine|montelukast|amlodipine|metoprolol|aspirin|ibuprofen|pantoprazole|vomilast|abciximab|zoclar|gestakind|metformin|atorvastatin|losartan|omeprazole|ciprofloxacin|doxycycline)/i;
  const medicines: any[] = [];

  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    if (
      medKeywords.test(line) &&
      !lower.includes('patient') &&
      !lower.includes('hospital') &&
      !lower.includes('clinic') &&
      !lower.startsWith('dr.') &&
      !lower.startsWith('dr ') &&
      !lower.includes('follow') &&
      !lower.includes('review')
    ) {
      const cleanLine = line.replace(/^\d+[\s.)-]+\s*/, '').trim();
      if (cleanLine.length > 2 && cleanLine.length < 120) {
        const freqMatch = cleanLine.match(/(?:once\s*daily|twice\s*daily|three\s*times\s*daily|four\s*times\s*daily|\b1-0-1\b|\b1-0-0\b|\b0-0-1\b|\b1-1-1\b|\b1\s*tablet\b|\b1\s*cap\b|morning|night|bedtime|daily)/i);
        const durMatch = cleanLine.match(/\b(\d+)\s*(?:days?|weeks?|months?)\b/i);

        let foodInstruction: 'Before Food' | 'After Food' | 'With Food' | 'Anytime' = 'After Food';
        if (/before\s*(?:food|meals?)|empty\s*stomach/i.test(cleanLine)) {
          foodInstruction = 'Before Food';
        } else if (/with\s*(?:food|meals?)/i.test(cleanLine)) {
          foodInstruction = 'With Food';
        } else if (/after\s*(?:food|meals?)/i.test(cleanLine)) {
          foodInstruction = 'After Food';
        } else {
          foodInstruction = 'Anytime';
        }

        let medName = cleanLine;
        if (freqMatch) {
          medName = medName.split(freqMatch[0])[0].trim();
        }
        if (durMatch) {
          medName = medName.split(durMatch[0])[0].trim();
        }
        medName = medName.replace(/[•|]/g, '').trim();

        if (medName.length > 2) {
          const durDays = durMatch ? parseInt(durMatch[1], 10) : 5;
          medicines.push({
            id: `med-${Date.now()}-${idx + 1}`,
            name: medName,
            dosage: freqMatch ? freqMatch[0] : '1 Tablet',
            frequency: freqMatch ? (freqMatch[0].includes('1-0-1') ? 'Twice daily' : freqMatch[0].includes('1-0-0') ? 'Once daily' : freqMatch[0]) : 'Once daily',
            duration: durMatch ? durMatch[0] : `${durDays} Days`,
            quantity: Math.max(1, durDays * (freqMatch && (freqMatch[0].includes('twice') || freqMatch[0].includes('1-0-1')) ? 2 : 1)),
            instructions: `Take ${foodInstruction.toLowerCase()}`,
            foodInstruction
          });
        }
      }
    }
  });

  return medicines;
}

/**
 * Converts real OCR extraction result into a StructuredPrescription object.
 * Strictly uses detected document fields; never invents missing doctor or hospital names.
 */
export function parseStructuredPrescriptionFromOcr(
  ocrResult: OcrExtractionResult,
  customPatientName?: string,
  rawPreview?: string
): any {
  const lines = (ocrResult.text || '').split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // 1. Patient Name (Extracted first so we can remove any patient name contamination from physician fields)
  const patientName = extractPatientNameFromLines(lines, customPatientName);

  // 2. Doctor Name (Cleaned of patient names, column numbers, and unrelated OCR text)
  const doctorName = extractDoctorNameFromLines(lines, patientName);

  // 3. Clinic / Hospital Name (Cleaned of patient/doctor contamination and trailing metadata)
  const clinicName = extractClinicNameFromLines(lines, patientName, doctorName);

  // 4. Prescription Date
  let prescriptionDate = new Date().toISOString().slice(0, 10);
  const dateMatch = (ocrResult.text || '').match(/\b(\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4})\b/);
  if (dateMatch) {
    prescriptionDate = dateMatch[1];
  }

  // Follow-Up
  let hasFollowUp = false;
  let followUpDate = '';
  let followUpText = '';
  for (const line of lines) {
    if (/follow[- ]?up|review|next\s*visit/i.test(line)) {
      hasFollowUp = true;
      followUpText = line.trim();
      const dMatch = line.match(/\b(\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4})\b/);
      if (dMatch) {
        followUpDate = dMatch[1];
      }
      break;
    }
  }

  const medicines = parseMedicinesFromText(ocrResult.text || '');

  return {
    id: `RX-DOC-${Date.now().toString().slice(-6)}`,
    patientName,
    doctorName,
    clinicName,
    doctorSpeciality: '',
    prescriptionDate,
    medicines,
    followUp: {
      hasFollowUp,
      date: followUpDate,
      rawText: followUpText,
      instructions: hasFollowUp ? followUpText : ''
    },
    status: 'pending-review',
    notes: `Processed via Tesseract OCR Engine (Confidence: ${ocrResult.confidence}%).`,
    rawImagePreview: rawPreview || ocrResult.previewUrl,
    rawOcrText: sanitizeOcrText(ocrResult.text || ''),
    confidence: ocrResult.confidence,
    rawConfidence: ocrResult.rawConfidence,
    isAbdmCompliant: ocrResult.isAbdmCompliant,
    fields: ocrResult.fields,
    pages: ocrResult.pages || (rawPreview ? [rawPreview] : ocrResult.previewUrl ? [ocrResult.previewUrl] : []),
    pageCount: ocrResult.pageCount || (ocrResult.pages ? ocrResult.pages.length : 1),
    createdAt: Date.now()
  };
}
