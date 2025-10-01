// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend('re_CiwEifnn_L9Jpbv9SXjd1ZuRym39fQBrJ');

export async function sendVerificationEmail(email: string, verificationCode: string): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Используем тестовый домен Resend
      to: email,
      subject: 'Подтверждение email - Ваш код подтверждения',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Подтверждение email</h2>
          <p style="color: #666; font-size: 16px;">Здравствуйте!</p>
          <p style="color: #666; font-size: 16px;">Для завершения регистрации введите следующий код подтверждения:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed #ddd;">
            <h1 style="margin: 0; color: #2c5aa0; font-size: 36px; letter-spacing: 8px; font-weight: bold;">${verificationCode}</h1>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Код действителен в течение <strong>24 часов</strong>.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Если вы не регистрировались в нашей системе, проигнорируйте это письмо.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return false;
    }

    console.log('Email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
