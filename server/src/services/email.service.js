const transporter = require('../config/mailer')

const sendWelcomeEmail = async ({ name, email, password, role }) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173'

  const mailOptions = {
    from: `"Placement Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Placement Tracker — Your Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1f2937; color: #ffffff; padding: 32px; border-radius: 12px;">
        
        <h1 style="color: #60a5fa; margin-bottom: 8px;">Placement Tracker</h1>
        <p style="color: #9ca3af; margin-bottom: 32px;">Your CS Placement Preparation Community</p>

        <h2 style="margin-bottom: 16px;">Hey ${name}! 👋</h2>
        <p style="color: #d1d5db; margin-bottom: 24px;">
          Your account has been created. Here are your login credentials:
        </p>

        <div style="background-color: #374151; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0;"><span style="color: #9ca3af;">Email:</span> <strong>${email}</strong></p>
          <p style="margin: 0 0 8px 0;"><span style="color: #9ca3af;">Password:</span> <strong>${password}</strong></p>
          <p style="margin: 0;"><span style="color: #9ca3af;">Role:</span> <strong>${role}</strong></p>
        </div>

        <p style="color: #d1d5db; margin-bottom: 16px;">
          Your account is currently <strong style="color: #f59e0b;">inactive</strong>. 
          You will receive another email with a login button once your account is activated.
        </p>

        <div style="background-color: #1e3a5f; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #60a5fa;">
          <p style="margin: 0; color: #93c5fd; font-size: 14px;">
            📌 Please save these credentials safely. Change your password after your first login.
          </p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
          This is an automated email from Placement Tracker. Please do not reply.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

const sendActivationEmail = async ({ name, email }) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173'

  const mailOptions = {
    from: `"Placement Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Placement Tracker Account is Now Active! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1f2937; color: #ffffff; padding: 32px; border-radius: 12px;">
        
        <h1 style="color: #60a5fa; margin-bottom: 8px;">Placement Tracker</h1>
        <p style="color: #9ca3af; margin-bottom: 32px;">Your CS Placement Preparation Community</p>

        <h2 style="margin-bottom: 16px;">Hey ${name}! 🎉</h2>
        <p style="color: #d1d5db; margin-bottom: 24px;">
          Great news! Your account has been <strong style="color: #4ade80;">activated</strong>. 
          You can now log in and start tracking your placement preparation!
        </p>

        <div style="background-color: #374151; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0;"><span style="color: #9ca3af;">Email:</span> <strong>${email}</strong></p>
        </div>

        <a href="${appUrl}/login" 
           style="display: block; background-color: #2563eb; color: white; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-bottom: 24px;">
          Login to Placement Tracker →
        </a>

        <div style="background-color: #1a3a2a; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #4ade80;">
          <p style="margin: 0; color: #86efac; font-size: 14px;">
            💡 Tip: Submit daily to maintain your streak and earn badges!
          </p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
          This is an automated email from Placement Tracker. Please do not reply.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}
module.exports = { sendWelcomeEmail, sendActivationEmail }