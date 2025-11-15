import { guestRouter } from '#plugins/index.js'
import OAuthServer from 'oauth2-server'

export default (app) => {  
  const router = guestRouter(app)

  router.post('/token', async (req, res) => {
    const request = new OAuthServer.Request(req)
    const response = new OAuthServer.Response(res)
    const token = await app.oauth.token(request, response, { allowExtendedTokenAttributes: true })
    return res.formatter.ok(token)
  })


  router.post('/refresh', async (req, res) => {
    try {

      console.log('req', req.body);
      
      const request = new OAuthServer.Request(req)
      const response = new OAuthServer.Response(res)

      const token = await app.oauth.token(request, response, {
        allowExtendedTokenAttributes: true
      })

      // Xoá password nếu có
      if (token.user && token.user.password) {
        delete token.user.password
      }

      return res.formatter.ok(token)
    } catch (err) {
      console.error('Refresh error:', err)
      return res.formatter.forbidden()
    }
  })

 



  return router
}

