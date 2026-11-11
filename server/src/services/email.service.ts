import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

const port = Number(config.smtp.port || process.env.SMTP_PORT || 587);
const isSecure = port === 465;

// Single reusable transporter instance at application/service level with conservative connection pooling
const transporter: Transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  host: config.smtp.host || process.env.SMTP_HOST || 'smtp.gmail.com',
  port: port,
  secure: isSecure,
  requireTLS: !isSecure,
  auth: {
    user: config.smtp.user || process.env.SMTP_USER,
    pass: config.smtp.pass || process.env.SMTP_PASS,
  },
});

export interface RoleTheme {
  primaryGradient: string;
  badgeBg: string;
  badgeBorder: string;
  badgeIcon: string;
  roleTitle: string;
  bodyBgGradient: string;
  otpContainerBg: string;
  otpBorder: string;
  otpLabelColor: string;
  otpTextColor: string;
  accentColor: string;
  accentBadgeText: string;
}

const ROLE_THEMES: Record<string, RoleTheme> = {
  // Patient Theme - MediCare Official Rounded Teal Pulse Tile Logo
  patient: {
    primaryGradient: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #00a896 100%)',
    badgeBg: 'transparent',
    badgeBorder: 'transparent',
    badgeIcon: '<img src="cid:medicare-logo" alt="MediCare" width="56" height="56" style="display: block; width: 56px; height: 56px; margin: 0 auto; border: 0; outline: none;" />',
    roleTitle: 'Patient Portal Verification',
    bodyBgGradient: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)',
    otpContainerBg: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)',
    otpBorder: '#99f6e4',
    otpLabelColor: '#0d9488',
    otpTextColor: '#0f766e',
    accentColor: '#0f766e',
    accentBadgeText: 'Patient Care Circle',
  },
  // Doctor Theme - Clinical Royal Blue / Indigo (Authoritative, Academic, Clinical)
  doctor: {
    primaryGradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
    badgeBg: 'rgba(255, 255, 255, 0.20)',
    badgeBorder: 'rgba(255, 255, 255, 0.35)',
    badgeIcon: '🩺',
    roleTitle: 'Physician Clinical Verification',
    bodyBgGradient: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
    otpContainerBg: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
    otpBorder: '#bfdbfe',
    otpLabelColor: '#2563eb',
    otpTextColor: '#1e40af',
    accentColor: '#1d4ed8',
    accentBadgeText: 'Doctor License Verified',
  },
  // Nurse Theme - Vibrant Violet / Purple (Empathetic, Responsive, Care Team)
  nurse: {
    primaryGradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    badgeBg: 'rgba(255, 255, 255, 0.20)',
    badgeBorder: 'rgba(255, 255, 255, 0.35)',
    badgeIcon: '👩‍⚕️',
    roleTitle: 'Nursing Care Team Verification',
    bodyBgGradient: 'linear-gradient(180deg, #f5f3ff 0%, #f8fafc 100%)',
    otpContainerBg: 'linear-gradient(135deg, #faf5ff 0%, #f8fafc 100%)',
    otpBorder: '#ddd6fe',
    otpLabelColor: '#7c3aed',
    otpTextColor: '#6d28d9',
    accentColor: '#6d28d9',
    accentBadgeText: 'Clinical Staff Verified',
  },
  // Pharmacist Theme - Deep Amber / Warm Gold / Orange (Apothecary, Dispense, Precision)
  pharmacist: {
    primaryGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)',
    badgeBg: 'rgba(255, 255, 255, 0.20)',
    badgeBorder: 'rgba(255, 255, 255, 0.35)',
    badgeIcon: '💊',
    roleTitle: 'Pharmacy & Drug Dispense Verification',
    bodyBgGradient: 'linear-gradient(180deg, #fffbeb 0%, #f8fafc 100%)',
    otpContainerBg: 'linear-gradient(135deg, #fffbeb 0%, #f8fafc 100%)',
    otpBorder: '#fde68a',
    otpLabelColor: '#b45309',
    otpTextColor: '#92400e',
    accentColor: '#b45309',
    accentBadgeText: 'PCI License Verified',
  },
  // Caregiver Theme - Rose / Soft Coral (Guardian, Family Support, Warmth)
  caregiver: {
    primaryGradient: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)',
    badgeBg: 'rgba(255, 255, 255, 0.20)',
    badgeBorder: 'rgba(255, 255, 255, 0.35)',
    badgeIcon: '🤝',
    roleTitle: 'Family Caregiver Verification',
    bodyBgGradient: 'linear-gradient(180deg, #fff1f2 0%, #f8fafc 100%)',
    otpContainerBg: 'linear-gradient(135deg, #fff1f2 0%, #f8fafc 100%)',
    otpBorder: '#fecdd3',
    otpLabelColor: '#e11d48',
    otpTextColor: '#be123c',
    accentColor: '#be123c',
    accentBadgeText: 'Care Circle Guardian',
  },
  // Insurance Theme - Slate / Cyan / Steel (Corporate, Security, Compliance)
  insurance: {
    primaryGradient: 'linear-gradient(135deg, #0e7490 0%, #0284c7 50%, #0369a1 100%)',
    badgeBg: 'rgba(255, 255, 255, 0.20)',
    badgeBorder: 'rgba(255, 255, 255, 0.35)',
    badgeIcon: '📑',
    roleTitle: 'Insurance & Claims Verification',
    bodyBgGradient: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)',
    otpContainerBg: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)',
    otpBorder: '#bae6fd',
    otpLabelColor: '#0284c7',
    otpTextColor: '#0369a1',
    accentColor: '#0284c7',
    accentBadgeText: 'Clearinghouse Verified',
  },
};

export class EmailService {
  /**
   * Get the single reusable Nodemailer SMTP transporter
   */
  static getTransporter(): Transporter {
    return transporter;
  }

  /**
   * Diagnostic SMTP connection check (run once at startup or on demand, not per request)
   */
  static async verifyConnection(): Promise<boolean> {
    try {
      await transporter.verify();
      console.log('✓ [EmailService] SMTP transporter connection verified and pooled successfully.');
      return true;
    } catch (err: any) {
      console.error('✗ [EmailService] SMTP verification failed:', err.message || err);
      return false;
    }
  }

  /**
   * Send 6-digit Email Verification OTP with role-customized theme
   */
  static async sendVerificationOtpEmail(toEmail: string, otpCode: string, recipientName?: string, role?: string): Promise<void> {
    const transporter = this.getTransporter();
    
    // Log ONLY the recipient email safely during development
    console.log(`[OTP] Sending verification email to: ${toEmail} (Role: ${role || 'default'})`);

    // Authenticated Gmail sender identity
    const senderName = config.smtp.from || 'MediCare';
    const fromAddress = `"${senderName}" <${config.smtp.user}>`;
    const replyToAddress = config.smtp.user;

    const subject = 'MediCare Email Verification Code';

    // Resolve theme based on role (fallback to patient theme)
    const normalizedRole = (role || '').toLowerCase().trim();
    const theme = ROLE_THEMES[normalizedRole] || ROLE_THEMES.patient;

    // Helper to format clean display name:
    // If recipientName or email contains full email address (e.g. "test123@gmail.com"), extract username before '@',
    // strip trailing numbers/special chars if applicable or capitalize nicely (e.g. "test123@gmail.com" -> "Test", "jerom@gmail.com" -> "Jerom")
    const cleanRawName = (recipientName || '').trim();
    let nameCandidate = cleanRawName;

    // Check if recipient entered their email address in the name field or if it has '@'
    if (!nameCandidate || nameCandidate.includes('@')) {
      const emailLocalPart = (nameCandidate.includes('@') ? nameCandidate : toEmail).split('@')[0];
      // Strip numbers or punctuation to extract clean human name (e.g. "lalitha496" -> "Lalitha")
      const alphaOnly = emailLocalPart.replace(/[^a-zA-Z]/g, '');
      nameCandidate = alphaOnly.length >= 2 ? alphaOnly : emailLocalPart;
    }

    // Capitalize first letter cleanly
    const displayName = nameCandidate 
      ? nameCandidate.charAt(0).toUpperCase() + nameCandidate.slice(1).toLowerCase() 
      : 'User';

    const greeting = `Hello ${displayName},`;

    const textContent = [
      greeting,
      '',
      `Your MediCare email verification code for ${theme.roleTitle} is:`,
      '',
      otpCode,
      '',
      'This code expires in 10 minutes.',
      '',
      'If you did not request this verification code, you can safely ignore this email.',
      '',
      'Regards,',
      'MediCare Team'
    ].join('\n');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>MediCare Verification Code</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, span { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${theme.bodyBgGradient}; background-color: #f8fafc; padding: 48px 16px;">
    <tr>
      <td align="center">
        <!-- WRAPPER CARD -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8); overflow: hidden; border-collapse: separate;">
          
          <!-- BRAND HEADER WITH ROLE GRADIENT & ICON -->
          <tr>
            <td style="background: ${theme.primaryGradient}; padding: 36px 40px 32px 40px; text-align: center;">
              <!-- ROLE BADGE -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                <tr>
                  <td align="center" valign="middle" style="width: 56px; height: 56px; text-align: center; vertical-align: middle;">
                    ${theme.badgeIcon.startsWith('<') ? theme.badgeIcon : `<div style="width: 52px; height: 52px; background-color: ${theme.badgeBg}; border-radius: 14px; border: 1px solid ${theme.badgeBorder}; line-height: 52px; font-size: 26px; margin: 0 auto;">${theme.badgeIcon}</div>`}
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 4px 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.4px;">
                MediCare
              </h1>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase;">
                ${theme.roleTitle}
              </p>
            </td>
          </tr>

          <!-- MAIN CONTENT BODY -->
          <tr>
            <td style="padding: 38px 40px 32px 40px;">
              <h2 style="margin: 0 0 8px 0; font-size: 19px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">
                ${greeting}
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #475569;">
                Please use the one-time verification code below to authenticate your MediCare account.
              </p>

              <!-- OTP CODE CONTAINER WITH GLOW & ROLE ACCENTS -->
              <div style="background: ${theme.otpContainerBg}; border: 2px dashed ${theme.otpBorder}; border-radius: 16px; padding: 24px 20px; text-align: center; margin: 0 0 24px 0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: ${theme.otpLabelColor}; letter-spacing: 1.5px; text-transform: uppercase;">
                  Your Verification Code
                </p>
                <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, Consolas, Monaco, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: ${theme.otpTextColor}; text-indent: 10px; display: inline-block;">
                  ${otpCode}
                </div>
              </div>

              <!-- TIME EXPIRY NOTICE -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 10px; padding: 10px 14px; margin: 0 0 24px 0; border: 1px solid #e2e8f0;">
                <tr>
                  <td width="22" valign="middle" style="font-size: 15px; line-height: 1; padding-right: 8px;">
                    ⏱️
                  </td>
                  <td style="font-size: 13px; line-height: 18px; color: #64748b;">
                    This code is strictly confidential and expires in <strong style="color: #0f172a;">10 minutes</strong>.
                  </td>
                </tr>
              </table>

              <!-- SECURITY NOTICE -->
              <p style="margin: 0 0 28px 0; font-size: 13px; line-height: 20px; color: #64748b;">
                Never share this verification code with anyone. MediCare representatives will never ask for your code. If you did not initiate this request, you can safely ignore this email.
              </p>

              <!-- DIVIDER -->
              <div style="height: 1px; background-color: #e2e8f0; margin: 0 0 24px 0;"></div>

              <!-- SIGNATURE -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #334155;">
                      Warm regards,<br>
                      <strong style="color: ${theme.accentColor}; font-size: 14px;">The MediCare Security Team</strong>
                    </p>
                  </td>
                  <td align="right" valign="bottom">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #f1f5f9; border-radius: 6px; font-size: 11px; font-weight: 600; color: #64748b;">
                      ${theme.accentBadgeText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CLEAN FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 500;">
                MediCare Digital Healthcare Platform &bull; Ayushman Bharat Digital Mission (ABDM)
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 16px;">
                This is an automated system email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Check if patient logo attachment should be embedded via CID
    const logoFilePath = path.resolve(__dirname, '../assets/medicare-patient-logo.png');
    const attachments: any[] = [];
    if (normalizedRole === 'patient' && fs.existsSync(logoFilePath)) {
      attachments.push({
        filename: 'medicare-patient-logo.png',
        path: logoFilePath,
        cid: 'medicare-logo',
      });
    }

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        replyTo: replyToAddress,
        subject: subject,
        text: textContent,
        html: htmlContent,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      console.log(`[EmailService] OTP email sent successfully to ${toEmail}. MessageId: ${info.messageId}`);
    } catch (error: any) {
      console.error(`[EmailService] Error sending verification email to ${toEmail}:`, error.message || error);
      throw new Error(`Failed to send verification email: ${error.message || 'SMTP delivery failed'}`);
    }
  }
}
