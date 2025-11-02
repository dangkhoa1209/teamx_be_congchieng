import { guestRouter } from '#plugins/index.js'
import OAuthServer from 'oauth2-server'
import globalErrorHandler from "#middlewares/globalErrorHandler.js"

export default (app) => {  
  const router = guestRouter(app)



  router.post('/token', async (req, res) => {
    const request = new OAuthServer.Request(req)
    const response = new OAuthServer.Response(res)

    
      const token = await app.oauth.token(request, response, { allowExtendedTokenAttributes: true })

      console.log('token', token);
      
      res.json(token)
  })
  // router.post('/token', app.oauth.token({ allowExtendedTokenAttributes: true }), globalErrorHandler)
  return router
}
// import express from 'express'

// const router = express.Router()

// router.post('/token', () => {})

// export default router
