import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const formatPath = (routePath, prefix = '') => {
  if (prefix) {
    if (!prefix.startsWith('/')) prefix = '/' + prefix
    if (prefix.endsWith('/')) prefix = prefix.slice(0, -1)
    routePath = prefix + routePath
  }
  return routePath.replaceAll(/\[(.[^[^\]]*)\]/g, ':$1')
}

const processRoutePath = async (app, basePath, options = {}) => {  
  const {
    prefix = '',
    path: subPath = '',
    middlewares = [],
  } = options

  const validMiddlewares = Array.isArray(middlewares)
    ? middlewares.filter(fn => typeof fn === 'function')
    : (typeof middlewares === 'function' ? [middlewares] : [])

  const paramList = []
  const folderList = []
  const fileList = []

  const dir = path.join(basePath, subPath)
  const dirInfo = await fs.promises.readdir(dir)  

  for (const filename of dirInfo) {
    const filepath = path.join(dir, filename)
    const stat = await fs.promises.stat(filepath)

    if (stat.isDirectory()) {
      
      if (filename.match(/\[(.[^[^\]]*)\]/)) {
        paramList.push({ path: path.join(subPath, filename) })
      } else {
        folderList.push({ path: path.join(subPath, filename) })
      }
    } else if (['.js', '.ts'].includes(path.extname(filename))) {
      fileList.push({
        router: subPath.startsWith('/') ? subPath : `/${subPath}`,
        path: filepath,
        filename,
      })
    }
  }

  for (const folder of folderList) {
    await processRoutePath(app, basePath, {
      ...options,
      path: folder.path,
    })
  }

  const indexList = []

  for (const file of fileList) {
    if (file.filename !== 'index.js' && file.filename !== 'index.ts') {
      const fn = file.filename.split('.')[0]
      const path = file.router == '/' ? '' : file.router
      const routerPath = `${path}/${fn}`
      const fullPath = formatPath(routerPath, prefix)
      const fileUrl = pathToFileURL(file.path).href
      const module = await import(fileUrl)
      const routes = module.default || module      

      if (routes && typeof routes.use === 'function') {
        app.use(fullPath, ...validMiddlewares, routes)
      } else if (typeof routes === 'function') {
        app.use(fullPath, ...validMiddlewares, routes(app))
      } else {
        console.warn(`⚠️ Route ${file.path} không hợp lệ, bỏ qua.`)
      }
    } else {
      indexList.push(file)
    }
  }

  for (const folder of paramList) {
    await processRoutePath(app, basePath, {
      ...options,
      path: folder.path,
    })
  }

  for (const file of indexList) {
    const fileUrl = pathToFileURL(file.path).href
    const module = await import(fileUrl)
    const routes = module.default || module
    const fullPath = formatPath(file.router, prefix)
    
    if (routes && typeof routes.use === 'function') {
      app.use(fullPath, ...validMiddlewares, routes)
    } else if (typeof routes === 'function') {
      app.use(fullPath, ...validMiddlewares, routes(app))
    } else {
      console.warn(`⚠️ Route ${file.path} không hợp lệ, bỏ qua.`)
    }

  }
}

export default processRoutePath
