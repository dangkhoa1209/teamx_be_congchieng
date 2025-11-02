import winston from 'winston'

const { combine, timestamp, printf, colorize } = winston.format

const format = printf(({ level, message, timestamp }) => {
  const msg = message instanceof Error ? message.stack : message
  return `${timestamp} [${level}]: ${msg}`
})

const logger = winston.createLogger({
  level: 'error',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
})

export default logger
