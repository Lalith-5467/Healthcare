import nodemailer, { Transporter } from 'nodemailer';
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
   * Send 6-digit Email Verification OTP
   */
  static async sendVerificationOtpEmail(toEmail: string, otpCode: string): Promise<void> {
    const transporter = this.getTransporter();
    
    // Log ONLY the recipient email safely during development
    console.log(`[OTP] Sending verification email to: ${toEmail}`);

    // Authenticated Gmail sender identity
    const senderName = config.smtp.from || 'MediCare';
    const fromAddress = `"${senderName}" <${config.smtp.user}>`;
    const replyToAddress = config.smtp.user;

    const subject = 'MediCare Email Verification Code';

    const textContent = [
      'Hello,',
      '',
      'Your MediCare email verification code is:',
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
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediCare Email Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background-color: #0f766e; padding: 24px 32px; text-align: left;">
              <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px;">
                MediCare
              </span>
            </td>
          </tr>

          <!-- MAIN BODY -->
          <tr>
            <td style="padding: 32px 32px 28px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #1e293b;">
                Hello,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #334155;">
                Your MediCare email verification code is:
              </p>

              <!-- OTP CODE BOX -->
              <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px 24px; text-align: center; margin: 0 0 24px 0;">
                <span style="font-family: Consolas, 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0f766e; display: inline-block;">
                  ${otpCode}
                </span>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                This code expires in 10 minutes.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #64748b;">
                If you did not request this verification code, you can safely ignore this email.
              </p>

              <p style="margin: 0; font-size: 14px; line-height: 22px; color: #334155;">
                Regards,<br>
                <strong>MediCare Team</strong>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 18px;">
                This is an automated verification message sent by MediCare Healthcare System.
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

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        replyTo: replyToAddress,
        subject: subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[EmailService] OTP email sent successfully to ${toEmail}. MessageId: ${info.messageId}`);
    } catch (error: any) {
      console.error(`[EmailService] Error sending verification email to ${toEmail}:`, error.message || error);
      throw new Error(`Failed to send verification email: ${error.message || 'SMTP delivery failed'}`);
    }
  }
}
