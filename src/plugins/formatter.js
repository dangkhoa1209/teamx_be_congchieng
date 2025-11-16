export const slugifyFn = (str) => {
  return str
    .normalize('NFD')    
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')               
    .replace(/Đ/g, 'd')              
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')     
    .replace(/\s+/g, '-')             
    .replace(/-+/g, '-')             
}

export const removeVietnameseTones = (str) => {
  if (!str) return ''

  let output = str

  // 1. Tách dấu (NFD) và bỏ các ký tự dấu
  output = output.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // 2. Chuyển đ / Đ
  output = output.replace(/đ/g, 'd').replace(/Đ/g, 'D')

  // 3. Thay ký tự xuống dòng, tab, nhiều khoảng trắng thành 1 space
  output = output.replace(/[\r\n\t]+/g, ' ')  // xuống dòng, tab → space
  output = output.replace(/\s+/g, ' ')        // nhiều space liên tiếp → 1 space

  // 4. Trim khoảng trắng đầu cuối
  output = output.trim()

  return output
}

