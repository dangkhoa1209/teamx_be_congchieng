import express from 'express'
import cors from 'cors'
import { processRoutePath } from '#plugins/index.js'
import { fileURLToPath } from 'url'
import path from 'path'
import normalizeFileMiddleware from '#plugins/normalizeFiles.js'

const app = express()

const host = process.env.LISTEN_HOST || 'localhost'
const port = parseInt(process.env.LISTEN_PORT || '3001', 10)

app.use(cors())
app.use(express.json())

const startup = async () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  await processRoutePath(app, `${__dirname}/routes`, {
    prefix: '',
    middlewares: normalizeFileMiddleware
  })

  app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on: http://${host}:${port}`)
  })
}
startup()