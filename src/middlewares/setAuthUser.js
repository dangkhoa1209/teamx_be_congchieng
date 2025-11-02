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
    
    next()
  } catch (err) {
    return res.formatter.forbidden()
  }
}

export default setAuthUser
