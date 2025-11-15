import { authRouter } from '#plugins/index.js'
import { AdminNewsModule } from '#modules/index.js'
import {OAuthToken, OAuthRefreshToken} from '#models/index.js'
export default (app) => {
  const router = authRouter(app)  
   router.post('/logout', async (req, res) => {
    try {
      const token = req.token
      const user = req.user

      if (!token || !user) {
        return res.formatter.forbidden('No token')
      }

      const accessTokenValue = token.accessToken

      // ⛔ Xoá access token
      await OAuthToken.deleteOne({ accessToken: accessTokenValue })

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

      return res.formatter.ok('Đăng xuất thành công')
    } catch (err) {
      console.log(err);
      
      return res.formatter.unprocess('Đăng xuất không thành công')
    }
  })
  return router
}
