export const slugifyFn = (str) => {
  const result = str
    .normalize('NFD')    
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')               
    .replace(/Đ/g, 'd')              
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')     
    .replace(/\s+/g, '-')             
    .replace(/-+/g, '-')     
    
  const unique = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  return `${result}-${unique}`;

}

export const removeVietnameseTones = (str) => {
  if (!str) return ''

  let output = str

  // 1. Loại bỏ dấu tiếng Việt
  output = output.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  output = output.replace(/đ/g, 'd').replace(/Đ/g, 'd')

  // 2. Chuyển chữ hoa thành chữ thường
  output = output.toLowerCase()

  // 3. Loại bỏ các ký tự đặc biệt và dấu ngoặc
  // giữ lại chữ cái, số và khoảng trắng
  output = output.replace(/[^a-z0-9\s]/g, '')

  // 4. Thay các ký tự khoảng trắng liên tiếp bằng 1 khoảng trắng
  output = output.replace(/\s+/g, ' ')

  // 5. Xoá khoảng trắng đầu cuối
  output = output.trim()

  return output
}

export const convertToTimestamp = (optionValue) => {
  const now = new Date();
  let date;

  switch(optionValue) {
    case 'to-day':
      // Lấy timestamp từ 00:00 hôm nay
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'one-day-ago':
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      break;
    case 'one-week-ago':
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'one-month-ago':
      date = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'one-year-ago':
      date = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      return null; // Tất cả
  }

  return date.getTime(); // Trả về timestamp
}