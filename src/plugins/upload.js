import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

/**
 * Lưu file hoặc nhiều file vào thư mục chỉ định.
 * @param {object|array} files - 1 file hoặc mảng file (Multer hoặc custom)
 * @param {object} options
 * @param {string} options.dest - Thư mục đích (mặc định: ./uploads)
 * @param {array<string>} [options.allowedTypes] - Danh sách MIME types cho phép
 * @param {number} [options.maxSize] - Giới hạn dung lượng (bytes)
 * @returns {Promise<object|array>} Thông tin file hoặc mảng thông tin
 */
export async function saveFiles(files, options = {}) {
  const {
    dest = '', // /images
    allowedTypes = [], // 'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
    maxSize = 0 // 10 * 1024 * 1024 // 10MB
  } = options

  const dirSave = 'uploads'
  const cleanDest = dest.replace(/^\/+|\/+$/g, '')
  const pathSave = path.join(process.cwd(), dirSave, cleanDest)
  fs.mkdirSync(pathSave, { recursive: true })

  const fileList = Array.isArray(files) ? files : [files]

  const results = []

  for (const file of fileList) {
    if (!file) continue

    const { originalname, mimetype, buffer, size, path: tmpPath } = file

    // Kiểm tra loại file
    if (allowedTypes && Array.isArray(allowedTypes) && allowedTypes.length && !allowedTypes.includes(mimetype)) {
      throw new Error(`File ${originalname} không được phép (${mimetype})`)
    }

    // Kiểm tra dung lượng
    if (maxSize && size > maxSize) {
      throw new Error(`File ${originalname} vượt quá giới hạn dung lượng (${(maxSize / 1024 / 1024)}MB)`)
    }

    // Tạo tên file an toàn
    const ext = path.extname(originalname)
    const safeBase = path.basename(originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const filename = `${Date.now()}-${safeBase}${ext}`
    const targetPath = path.join(pathSave, filename)

    // Nếu có buffer (trường hợp từ multer memoryStorage hoặc custom)
    if (buffer) {
      await fs.promises.writeFile(targetPath, buffer)
    }
    // Nếu có path (trường hợp multer diskStorage)
    else if (tmpPath) {
      await fs.promises.copyFile(tmpPath, targetPath)
    } else {
      throw new Error(`Không có dữ liệu file cho ${originalname}`)
    }

    const url = `/${cleanDest ? cleanDest + '/' : ''}${filename}`
    results.push({
      originalName: originalname,
      fileName: filename,
      mimeType: mimetype,
      size,
      savedPath: targetPath,
      url
    })    
  }

  return Array.isArray(files) ? results : results[0]
}

/**
 * Đọc nội dung file đã lưu
 * @param {string} fullFilePath - đường dẫn file cần đọc
 * @param {object} [options] - { encoding: 'utf8' | null }
 * @returns {Promise<string|Buffer>}
 */
export async function readFile(fullFilePath, options = {}) {
  const { encoding = null } = options
  const data = await fs.promises.readFile(fullFilePath, { encoding })
  return data
}

export async function resFile(req, res, options = {}) {
  const {path1, path2, path3, path4, pathname} = req.params

  const filePath = [path1, path2, path3, path4, pathname]
    .filter(Boolean)
    .join('/')

  const fileFullPath = path.join(process.cwd(), 'uploads', filePath)
  if (!fs.existsSync(fileFullPath)) {
    return res.status(404).json({ error: 'Không tìm thấy file' })
  }

  const mimeType = mime.lookup(fileFullPath) || 'application/octet-stream'
  const fileBuffer = await readFile(fileFullPath, options)
  res.setHeader("Content-Type", mimeType)
  res.setHeader("Content-Length", fileBuffer.length)
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none")
  res.send(fileBuffer)
}

