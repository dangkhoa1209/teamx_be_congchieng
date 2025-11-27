import dotenv from 'dotenv'
dotenv.config()


import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import morgan from 'morgan'
import mongoose from 'mongoose'
import OAuthServer from 'oauth2-server'

import { processRoutePath, responseFormatter} from '#plugins/index.js'
import normalizeFileMiddleware from '#middlewares/normalizeFiles.js'
import globalErrorHandler from "#middlewares/globalErrorHandler.js"
import OAuthModel from '#config/oauth/index.js'
import {connectionString} from "#config/index.js"

import User from '#models/user.js'

const app = express()
const host = process.env.LISTEN_HOST || 'localhost'
const port = parseInt(process.env.LISTEN_PORT || '3001')

app.oauth = new OAuthServer({
  model: OAuthModel,
  grants: ['password'],
  useErrorHandler: true,
  continueMiddleware: false,
  accessTokenLifetime: 24 * 30 * 3600 
})

app.use(helmet())
app.use(compression())
app.use(cors())
// app.options('*', cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))
app.use(methodOverride('X-HTTP-Method-Override'))

responseFormatter(app)


if (process.env.NODE_ENV === 'production') {
  // logger = winston.createLogger({
  //   level: 'http',
  //   transports: [new winston.transports.Console()],
  //   format: combine(
  //     timestamp({
  //       format: 'YYYY-MM-DD hh:mm:ss.SSS A'
  //     }),
  //     json()
  //   )
  // })
  morgan.token('req-headers', (req, res) => {
    return JSON.stringify(req.headers)
  })

  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" - :response-time ms -  :req-headers'
    )
  )
} else {
  app.use(morgan('tiny'))
}

const startup = async () => {  
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  await processRoutePath(app, `${__dirname}/routes`, {
    prefix: '',
    middlewares: normalizeFileMiddleware
  })

  app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
      const user = new User({ username, password })
      await user.save()
      res.json({ message: 'User created' })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  })

  app.use(globalErrorHandler)

  app.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on: http://${host}:${port}`)
  })
}

const db = mongoose.connection
db.on('connected', () => {
  console.log('MongoDB connected!')
  startup()
})
db.on('error', (err) => {
  console.log('MongoDB error:')
  console.log(err)
})
db.on('reconnected', () => {
  console.log('MongoDB reconnected!')
})

mongoose.connect(connectionString)