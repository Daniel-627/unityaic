export function welcomeEmail(name: string) {
  return {
    subject: 'Welcome to Unity AIC Church',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
        <div style="background: #1B3A6B; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Unity AIC Church</h1>
          <p style="color: #C9A84C; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.2em;">Africa Inland Church Kenya</p>
        </div>
        <div style="border: 1px solid #E5E7EB; border-top: none; padding: 32px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1B3A6B; font-size: 20px;">Welcome, ${name}! 👋</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            Your account has been created successfully. You are now a registered member of Unity AIC Church.
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            You can now access your dashboard to view your giving history, ministry departments, events, and more.
          </p>
          <div style="margin: 28px 0;">
            <a href="${process.env.NEXTAUTH_URL}/login" style="background: #1B3A6B; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
              Sign In to Your Account
            </a>
          </div>
          <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6;">
            If you did not create this account, please ignore this email or contact us at info@unityaic.org.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Unity AIC Church · Nairobi, Kenya
          </p>
        </div>
      </div>
    `,
  }
}

export function passwordResetEmail(name: string, resetUrl: string) {
  return {
    subject: 'Reset Your Password — Unity AIC Church',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
        <div style="background: #1B3A6B; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Unity AIC Church</h1>
          <p style="color: #C9A84C; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.2em;">Password Reset</p>
        </div>
        <div style="border: 1px solid #E5E7EB; border-top: none; padding: 32px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1B3A6B; font-size: 20px;">Hi ${name},</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            We received a request to reset your password. Click the button below to set a new password.
            This link expires in <strong>1 hour</strong>.
          </p>
          <div style="margin: 28px 0;">
            <a href="${resetUrl}" style="background: #C9A84C; color: #1B3A6B; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
              Reset My Password
            </a>
          </div>
          <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6;">
            If you did not request a password reset, you can safely ignore this email. Your password will not change.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Unity AIC Church · Nairobi, Kenya
          </p>
        </div>
      </div>
    `,
  }
}

export function eventReminderEmail(name: string, eventTitle: string, eventDate: string, location: string | null) {
  return {
    subject: `Reminder: ${eventTitle} — Unity AIC Church`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
        <div style="background: #1B3A6B; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Unity AIC Church</h1>
          <p style="color: #C9A84C; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.2em;">Event Reminder</p>
        </div>
        <div style="border: 1px solid #E5E7EB; border-top: none; padding: 32px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1B3A6B; font-size: 20px;">Hi ${name},</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            This is a reminder that you are registered for the following event:
          </p>
          <div style="background: #F7F8FC; border: 1px solid #E5E7EB; border-left: 4px solid #C9A84C; border-radius: 8px; padding: 20px 24px; margin: 20px 0;">
            <h3 style="color: #1B3A6B; font-size: 18px; margin: 0 0 8px;">${eventTitle}</h3>
            <p style="color: #6B7280; font-size: 14px; margin: 4px 0;">📅 ${eventDate}</p>
            ${location ? `<p style="color: #6B7280; font-size: 14px; margin: 4px 0;">📍 ${location}</p>` : ''}
          </div>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            We look forward to seeing you there. God bless you.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Unity AIC Church · Nairobi, Kenya
          </p>
        </div>
      </div>
    `,
  }
}

export function contributionReceiptEmail(
  name:         string,
  receiptNo:    string,
  amount:       string,
  fund:         string,
  method:       string,
  date:         string,
) {
  return {
    subject: `Receipt #${receiptNo} — Unity AIC Church`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
        <div style="background: #1B3A6B; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Unity AIC Church</h1>
          <p style="color: #C9A84C; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.2em;">Contribution Receipt</p>
        </div>
        <div style="border: 1px solid #E5E7EB; border-top: none; padding: 32px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1B3A6B; font-size: 20px;">Thank you, ${name}!</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.7;">
            Your contribution has been recorded. Here are the details:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${[
              ['Receipt No.',  `#${receiptNo}`],
              ['Amount',       `KES ${amount}`],
              ['Fund',         fund],
              ['Method',       method],
              ['Date',         date],
            ].map(([label, value]) => `
              <tr>
                <td style="padding: 10px 12px; background: #F7F8FC; border: 1px solid #E5E7EB; font-size: 13px; color: #6B7280; width: 40%;">${label}</td>
                <td style="padding: 10px 12px; border: 1px solid #E5E7EB; font-size: 13px; color: #1B3A6B; font-weight: 600;">${value}</td>
              </tr>
            `).join('')}
          </table>
          <p style="color: #374151; font-size: 14px; line-height: 1.7;">
            May God bless your giving. <em>"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."</em> — 2 Corinthians 9:7
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            Unity AIC Church · Nairobi, Kenya
          </p>
        </div>
      </div>
    `,
  }
}