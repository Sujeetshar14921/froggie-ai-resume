import nodemailer from "nodemailer";

/**
 * Creates and returns configured Nodemailer SMTP transporter.
 */
const getTransporter = () => {
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = parseInt(process.env.SMTP_PORT, 10) || 465;
  const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

  let user = (process.env.SMTP_USER || "froggieAi00@gmail.com").trim();
  if (user && !user.includes("@") && user.includes("gmail.com")) {
    user = user.replace("gmail.com", "@gmail.com");
  }

  // Google App Passwords may be entered with spaces (e.g. "tehz oiwl ffye qwkt"), strip spaces for standard auth
  const pass = (process.env.SMTP_PASSWORD || "").replace(/\s+/g, "");

  const isGmail = host.toLowerCase().includes("gmail");

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const getFromAddress = () => {
  let from = (process.env.SMTP_FROM || process.env.SMTP_USER || "froggieAi00@gmail.com").trim();
  if (from && !from.includes("@") && from.includes("gmail.com")) {
    from = from.replace("gmail.com", "@gmail.com");
  }
  return `"froggie AI" <${from}>`;
};

/**
 * Sends a 6-digit OTP email for account registration verification.
 */
export const sendSignupOtp = async (email, otp, name = "Candidate") => {
  const transporter = getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your froggie AI account</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: left;">
              <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                froggie<span style="color: #10b981;">.</span>
              </span>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ATS Smart Resume Studio
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                Verify Your Email Address
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Hi <strong>${name}</strong>, thank you for joining froggie AI! Please use the following 6-digit verification code to complete your signup:
              </p>
              
              <div style="background-color: #ecfdf5; border: 1px dashed #059669; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #047857; font-family: monospace;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                This code will expire in <strong>10 minutes</strong>. If you did not request this account creation, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} froggie AI. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  console.log(`[SMTP] Sending verification OTP ${otp} to ${email}...`);
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    replyTo: "support@froggie.site",
    subject: `${otp} is your froggie AI verification code`,
    text: `Your froggie AI verification code is: ${otp}. It expires in 10 minutes.`,
    html,
  });
  console.log(`[SMTP SUCCESS] Verification email sent to ${email}. Message ID: ${info.messageId}`);
  return info;
};

/**
 * Sends a 6-digit OTP email for password reset.
 */
export const sendResetPasswordOtp = async (email, otp, name = "Candidate") => {
  const transporter = getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your froggie AI password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: left;">
              <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                froggie<span style="color: #10b981;">.</span>
              </span>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Account Security
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                Password Reset Request
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Hi <strong>${name}</strong>, we received a request to reset your froggie AI account password. Enter this 6-digit code to choose a new password:
              </p>
              
              <div style="background-color: #fef2f2; border: 1px dashed #ef4444; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #b91c1c; font-family: monospace;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email — your account remains secure.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} froggie AI. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  console.log(`[SMTP] Sending password reset OTP ${otp} to ${email}...`);
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    replyTo: "support@froggie.site",
    subject: `${otp} is your froggie AI password reset code`,
    text: `Your froggie AI password reset code is: ${otp}. It expires in 10 minutes.`,
    html,
  });
  console.log(`[SMTP SUCCESS] Password reset email sent to ${email}. Message ID: ${info.messageId}`);
  return info;
};
