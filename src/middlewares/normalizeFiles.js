
import multer from 'multer'

const upload = multer()

export function normalizeFiles(req, res, next) {
  
  if (req.parsed) {
    next()
    return
  }

  const files = req.files  

  if(!files) {
    req.parsed = true
    next()
    return
  }

  let file  
  
  if (Array.isArray(files) && files.length === 1) {
    file = {
      [files[0].fieldname]: files[0]
    }
  } else if (Array.isArray(files) && files.length > 1) {
    file = {}
    files.forEach(f => {      
      if (file[f.fieldname]) {
        if (!Array.isArray(file[f.fieldname])) {
          file[f.fieldname] = [file[f.fieldname]]
        }
        file[f.fieldname].push(f)
      } else {
        file[f.fieldname] = f
      }
    })
  }

  Object.assign(req, {
    file,
    parsed: true
  })
  next()
}

export default [upload.any(), normalizeFiles]
