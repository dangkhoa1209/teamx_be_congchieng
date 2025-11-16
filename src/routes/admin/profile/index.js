import { authRouter } from '#plugins/index.js'
import {OAuthToken, OAuthRefreshToken, UserModel} from '#models/index.js'
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

        await OAuthToken.deleteOne({ accessToken: accessTokenValue })

        const refreshTokenRecord = await OAuthRefreshToken.findOne({
          user: user._id,
          client: token.client._id
        })

        if (refreshTokenRecord) {
          await OAuthRefreshToken.deleteOne({
            refreshToken: refreshTokenRecord.refreshToken
          })
        }

        return res.formatter.ok('Đăng xuất thành công')
      } catch (err) {      
        return res.formatter.unprocess('Đăng xuất không thành công')
      }
    })


    router.post('/change-password', async (req, res) => {
      try {
        const {_id, password, newPassword} = req.body
        const user = await UserModel.findById(_id);
        
        if(!user) {
          return res.formatter.unprocess('Không tìm thấy tài khoản')
        }
        
        const valid = await user.validatePassword(password)
        if(!valid) {
          return res.formatter.unprocess('Mật khẩu không đúng')
        }

        user.password = newPassword
        await user.save()

        // đăng xuất tất cả thiết bị khác
        const tokenId = req.token._id
        await OAuthToken.deleteMany({ 
          user: user._id, 
          _id: { $ne: tokenId } 
        })
        await OAuthRefreshToken.deleteMany({ 
          user: user._id, 
          accessToken: { $ne: tokenId } 
        })

        return res.formatter.ok()
      } catch (err) {      
        return res.formatter.unprocess('Đổi mật khẩu không thành công')
      }
    })

  return router
}
