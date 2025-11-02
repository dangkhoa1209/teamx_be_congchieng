import logger from '#plugins/logger.js'

export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  logger.error(err)
  if (process.env.NODE_ENV === 'development') {
    console.error('===== ERROR START =====')
    console.error(err)
    console.error('===== ERROR END =====')
  }

  const responseMessage = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Internal Server Error'
  
  res.formatter.serverError(responseMessage)
}


