const nodemailer = require('nodemailer');

const sendResetEmail = async (email, token) => {
  // Development Fallback: If no email config, log to console and return success
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log('--------------------------------------------------');
    console.log('[DEVELOPMENT MODE] Email config missing in .env');
    console.log(`[PASS RESET] Target: ${email}`);
    console.log(`[PASS RESET] Token: ${token}`);
    console.log('--------------------------------------------------');
    return true; 
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`; // Update this if you have a web reset page

    const mailOptions = {
      from: `"Flutter Library" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>You requested a password reset for your Flutter Library account.</p>
          <p>Please use the following token to reset your password in the app:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #007AFF; margin: 20px 0;">
            ${token}
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendResetEmail };
