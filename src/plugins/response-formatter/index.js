import methods from './methods.js'

const _generateSuccessResponse = ({
  data, meta, method, status
}) => ({
  success: true,
  data,
  meta,
  message: method.message,
  code: method.code,
  status: status || method.code,
  name: method.name
})

const _generateErrorResponse = ({
  errors, meta, method, status
}) => ({
  success: false,
  errors,
  meta,
  message: method.message,
  code: method.code,
  status: status || method.code,
  name: method.name
})

function stringify(value, replacer, spaces, escape) {
  let json = replacer || spaces ? JSON.stringify(value, replacer, spaces) : JSON.stringify(value)

  if (escape && typeof json === 'string') {
    json = json.replace(/[<>&]/g, (c) => {
      switch (c.charCodeAt(0)) {
        case 0x3c:
          return '\\u003c'
        case 0x3e:
          return '\\u003e'
        case 0x26:
          return '\\u0026'
        default:
          return c
      }
    })
  }

  return json
}
const generateFormatters = (res) => {
  const formatter = {} 
  const { app } = res
  const escape = app.get('json escape')
  const replacer = app.get('json replacer')
  const spaces = app.get('json spaces')
  let responseBody = {}
  if (!res.get('Content-Type')) {
    res.set('Content-Type', 'application/json')
  }

  methods.forEach((method) => {
    if (method.isSuccess) {
      formatter[method.name] = (
        data,
        meta,
        status,
        code,
        noFormatter
      ) => {
        if (res.success !== undefined && !res.success) {
          responseBody = _generateErrorResponse({
            errors: data,
            meta,
            method,
            status
          })
        } else {
          responseBody = _generateSuccessResponse({
            data,
            meta,
            method,
            status
          })
        }
        if (noFormatter || res.noFormatter) {
          res.send(stringify(data, replacer, spaces, escape))
        } else {
          res.status(code || method.code).send(stringify(responseBody, replacer, spaces, escape))
        }
      }
    } else {
      formatter[method.name] = (errors, meta, status, code) => {
        if (typeof errors === 'string') {
          errors = [errors]
        }
        if (typeof errors === 'object') {
          errors = [errors.message || errors]
        }
        responseBody = _generateErrorResponse({
          errors,
          meta,
          method,
          status
        })
        res.status(code || method.code).send(stringify(responseBody, replacer, spaces, escape))
      }
    }
  })

  return formatter
}

export default (app) => {
  Object.defineProperty(app.response, 'formatter', {
    configurable: true,
    enumerable: true,
    get() {
      return generateFormatters(this)
    }
  })
}
