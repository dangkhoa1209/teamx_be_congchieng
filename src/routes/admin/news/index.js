import { authRouter } from '#plugins/index.js'
import { AdminNewsModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  router.post('/', new AdminNewsModule().create)
  
   router.post('/logout', async (req, res) => {
    try {
      const token = req.token
      const user = req.user

      console.log('token', token);
      console.log('user', user);
      
      return
      if (!token || !user) {
        return res.formatter.forbidden('No token')
      }

      const accessTokenValue = token.accessToken

      // ⛔ Xoá access token
      await OAuthAccessToken.deleteOne({ accessToken: accessTokenValue })

      // 🔍 Tìm refresh token liên quan
      const refreshTokenRecord = await OAuthRefreshToken.findOne({
        user: user._id,
        client: token.client._id
      })

      // ⛔ Xoá refresh token nếu có
      if (refreshTokenRecord) {
        await OAuthRefreshToken.deleteOne({
          refreshToken: refreshTokenRecord.refreshToken
        })
      }

      return res.formatter.ok({
        message: 'Logout successful'
      })
    } catch (err) {
      console.error('Logout error:', err)
      return res.formatter.internalError('Logout failed')
    }
  })
  return router
}
