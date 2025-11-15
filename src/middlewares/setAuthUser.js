import { Request, Response } from 'oauth2-server'

const setAuthUser = async (app, req, res, next) => {
  try {  
    const request = new Request(req)
    const response = new Response(res)
    const token = await app.oauth.authenticate(request, response)
    if (!token.user) {
      return res.formatter.forbidden()
    }


    if (token.user && token.user.password) {
      delete token.user.password
    }
    
    req.user = token.user
    res.user = token.user
    res.token = token
    req.token = token    
    
    next()
  } catch (err) {
    if (err.name === 'invalid_token' && err.message.includes('expired')) {
      return res.formatter.unauthorized('Access token expired')
    }
    
    // Token không hợp lệ → unauthorized
    if (err.name === 'invalid_token') {
      return res.formatter.unauthorized('Access token invalid')
    }

    return res.formatter.forbidden()
  }
}

export default setAuthUser
