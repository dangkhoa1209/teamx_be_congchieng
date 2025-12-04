import sendMail from '../plugins/sendMail.js';

const sendContactMail = async (data) => {
  const { name, email, phone, description } = data;

  const subject = 'Liên hệ từ website Cồng chiêng Lâm Đồng';

  const safeName = name || 'N/A';
  const safeEmail = email || 'N/A';
  const safePhone = phone || 'N/A';
  const safeDescription = description || 'N/A';

  // ✅ Text fallback
  const text = `
Name: ${safeName}
Email: ${safeEmail}
Phone: ${safePhone}
Description: ${safeDescription}
  `;

  // ✅ HTML Template theo đúng màu thương hiệu
  const html = `
<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#FFF7EB;border:1px solid #4C2014;border-radius:10px;overflow:hidden">
  
  <!-- Header -->
  <div style="background:#4C2014;color:#FFF7EB;padding:18px 20px;text-align:center">
    <h2 style="margin:0;font-size:20px;">Liên hệ từ website</h2>
    <p style="margin:4px 0 0;font-size:14px;opacity:0.95;">Cồng chiêng Lâm Đồng</p>
  </div>

  <!-- Body -->
  <div style="padding:20px;color:#000000;font-size:14px;line-height:1.7">
    
    <p style="margin:0 0 14px;">
      Bạn vừa nhận được một liên hệ mới từ website:
    </p>

    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:8px 0;font-weight:600;width:120px;">Họ tên:</td>
        <td style="padding:8px 0;">${safeName}</td>
      </tr>

      <tr>
        <td style="padding:8px 0;font-weight:600;">Email:</td>
        <td style="padding:8px 0;">
          <a href="mailto:${safeEmail}" style="color:#4C2014;text-decoration:none;">
            ${safeEmail}
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding:8px 0;font-weight:600;">Số điện thoại:</td>
        <td style="padding:8px 0;">
          <a href="tel:${safePhone}" style="color:#4C2014;text-decoration:none;">
            ${safePhone}
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding:10px 0;font-weight:600;vertical-align:top;">Nội dung:</td>
        <td style="padding:10px 0;white-space:pre-line;">
          ${safeDescription}
        </td>
      </tr>
    </table>

  </div>

  <!-- Footer -->
  <div style="background:#4C2014;text-align:center;padding:12px;font-size:12px;color:#FFF7EB">
    © Bản quyền thuộc Sở Văn Hoá, Thể thao & Du lịch tỉnh Lâm Đồng
  </div>
</div>
  `;

  return await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
    html,
  });
};

export default sendContactMail;
