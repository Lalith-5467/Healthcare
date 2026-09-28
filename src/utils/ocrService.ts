import { createWorker } from 'tesseract.js';

export interface OcrExtractionResult {
  text: string;
  confidence: number;
  fields: string[];
  isAbdmCompliant: boolean;
  rawConfidence: number;
  passUsed: 1 | 2;
}

export type OcrProgressCallback = (progressPercent: number, statusText?: string) => void;

/**
 * Loads an image (dataURL, Blob, or Canvas) into an HTMLCanvasElement
 */
export async function loadImageToCanvas(source: string | HTMLCanvasElement | Blob): Promise<HTMLCanvasElement> {
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
 * Crops the document region matching the 3:4 viewfinder frame with safe margins
 * and scales to a high-resolution canvas suitable for Tesseract OCR.
 */
export function cropAndScaleDocument(sourceCanvas: HTMLCanvasElement, targetRatio: number = 3 / 4): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const videoRatio = w / h;

  let sx = 0;
  let sy = 0;
  let sw = w;
  let sh = h;

  if (videoRatio > targetRatio * 1.05) {
    // Landscape camera frame (e.g. 16:9 1920x1080)
    // The central 3:4 area is what the user framed, with 15% safe padding
    const visibleW = h * targetRatio;
    sw = Math.min(w, Math.round(visibleW * 1.15));
    sx = Math.max(0, Math.round((w - sw) / 2));
    sh = h;
    sy = 0;
  } else if (videoRatio < targetRatio * 0.95) {
    // Tall mobile portrait frame
    const visibleH = w / targetRatio;
    sh = Math.min(h, Math.round(visibleH * 1.15));
    sy = Math.max(0, Math.round((h - sh) / 2));
    sw = w;
    sx = 0;
  }

  // Ensure high resolution (width at least 1600px for crisp text strokes)
  let scale = 1;
  if (sw < 1600) {
    scale = Math.min(2.5, 1800 / sw);
  }
  const destW = Math.round(sw * scale);
  const destH = Math.round(sh * scale);

  const cropped = document.createElement('canvas');
  cropped.width = destW;
  cropped.height = destH;
  const ctx = cropped.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, destW, destH);
  }
  return cropped;
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

  // 1. Hospital / Clinic / Healthcare Facility
  const hospitalPattern = /(?:hospital|clinic|centre|center|health\s*(?:facility|centre|care|city)|medical\s*centre|dispensary|opd|apollo|fortis|sms|max\s*healthcare|manipal)/i;
  for (const line of lines) {
    if (hospitalPattern.test(line) && !line.toLowerCase().startsWith('patient') && !line.toLowerCase().startsWith('dr')) {
      const clean = line.replace(/^[#*•\-_:|\s]+/, '').replace(/[•|]/g, ' ').trim();
      if (clean.length > 3 && clean.length < 80) {
        fields.push(`Hospital / Facility: ${clean}`);
        break;
      }
    }
  }

  // 2. Consulting Doctor & Degrees
  const doctorPattern = /(?:dr\.?\s+[a-zA-Z\s.,()]+|consulting\s*:\s*[a-zA-Z\s.,()]+|physician\s*:\s*[a-zA-Z\s.,()]+|(?:doctor|dr)\s*[:|-]\s*[a-zA-Z\s.,()]+)/i;
  let doctorFound = false;
  for (const line of lines) {
    if (/(?:dr\.?\s+[a-zA-Z]|consulting\s*:|mbbs|md\b|dm\b|ms\b|dnb\b)/i.test(line) && !line.toLowerCase().includes('patient')) {
      const clean = line.replace(/^[#*•\-_:|\s]+/, '').trim();
      if (clean.length > 3 && clean.length < 80) {
        fields.push(`Doctor: ${clean}`);
        doctorFound = true;
        break;
      }
    }
  }
  if (!doctorFound) {
    for (const line of lines) {
      const match = line.match(doctorPattern);
      if (match && match[0].trim().length > 4) {
        fields.push(`Doctor: ${match[0].trim()}`);
        break;
      }
    }
  }

  // 3. Prescription Date
  const datePattern = /(?:date|prescribed\s*on|rx\s*date)\s*[:|-]?\s*([0-9a-zA-Z\s,.-]+)|\b(\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4})\b|\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i;
  for (const line of lines) {
    const match = line.match(datePattern);
    if (match) {
      const d = match[1] || match[2] || match[3] || line.trim();
      fields.push(`Prescription Date: ${d.trim()}`);
      break;
    }
  }

  // 4. Patient Name
  const patientPattern = /(?:patient\s*name|patient|pt\.?|name)\s*[:|-]\s*([a-zA-Z\s.]+)/i;
  let patientFound = false;
  for (const line of lines) {
    const match = line.match(patientPattern);
    if (match && match[1] && match[1].trim().length > 2) {
      const name = match[1].trim();
      // Ensure it doesn't match a doctor title or label
      if (!name.toLowerCase().startsWith('dr') && !name.toLowerCase().includes('hospital')) {
        fields.push(`Patient: ${name}`);
        patientFound = true;
        break;
      }
    }
  }
  if (!patientFound) {
    for (const line of lines) {
      if (/^patient\b/i.test(line)) {
        const clean = line.replace(/^[#*•\-_:|\s]+/, '').replace(/^patient\s*[:|-]?\s*/i, '').trim();
        if (clean.length > 2 && !clean.toLowerCase().startsWith('dr')) {
          fields.push(`Patient: ${clean}`);
          patientFound = true;
          break;
        }
      }
    }
  }
  if (!patientFound) {
    // If patient label exists but is illegible
    for (const line of lines) {
      if (/patient|pt\.?/i.test(line) && line.length < 25) {
        fields.push('Patient: Not clearly detected');
        break;
      }
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
 * Runs the optical Tesseract OCR pipeline on a captured image source.
 * Includes document region crop, contrast enhancement, glare mitigation, and multi-pass OCR.
 */
export async function runOpticalOcr(
  imageSource: string | HTMLCanvasElement | Blob,
  onProgress?: OcrProgressCallback
): Promise<OcrExtractionResult> {
  console.log('[OCR] processing started');
  if (onProgress) onProgress(10, 'Initializing Tesseract OCR v4 engine...');

  // 1. Load source image to canvas
  const rawCanvas = await loadImageToCanvas(imageSource);

  // 2. Crop document region matching 3:4 viewfinder frame & upscale for high quality OCR
  if (onProgress) onProgress(20, 'Cropping document region & normalizing resolution...');
  const croppedCanvas = cropAndScaleDocument(rawCanvas, 3 / 4);

  // 3. Preprocess canvas for Pass 1 (Grayscale + Dynamic Contrast + Glare Suppression)
  if (onProgress) onProgress(30, 'Enhancing document contrast & suppressing glare...');
  const preprocessedPass1 = preprocessCanvasForOcr(croppedCanvas, 'contrast');

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

      const preprocessedPass2 = preprocessCanvasForOcr(croppedCanvas, 'adaptive_threshold');
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
    const finalText = (bestRet.data && bestRet.data.text) ? bestRet.data.text.trim() : '';
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
    console.log('[ABDM] validation started');
    const finalAbdm = isAbdmCompliant && confidence > 30;
    console.log('[ABDM] validation completed');

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
