import transporter  from '../../config/mailer.js';

async function sendMail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Admin" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email đã gửi:', info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    return { success: false, error };
  }
}

export default sendMail
