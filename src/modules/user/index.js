import { UserModel, OAuthClient, OAuthRefreshToken, OAuthToken  } from "#models/index.js"

export default class UserModule {

  getUser = async (req, res) => {
    const result = res.user
    return res.formatter.ok(result)
  }

  changePassword = async (req, res) => {
    const { oldPassword } = req.body
    const { newPassword } = req.body
    const { _id } = res.user

    if (oldPassword === newPassword) {
      return res.formatter.unprocess('Vui lòng thay đổi mât khẩu')
    }
    const user = await UserModel.findOne({ _id }).select('+password')
    const check = await user?.validatePassword(oldPassword)

    if (user && check) {
      user.password = newPassword
      await user.save()
      return res.formatter.ok('Đổi mật khẩu thành công')
    }

    return res.formatter.unprocess('Mật khẩu không đúng')
  }


  logout = async (req, res) => {
    const { accessToken } = res.token || {}

    const oauthToken = await OAuthToken.findOne({ accessToken })
    const oauthRefreshToken = await OAuthRefreshToken.findOne({ accessToken: oauthToken })

    if (oauthToken && oauthRefreshToken) {
      await oauthRefreshToken.deleteOne()
      await oauthToken.deleteOne()
      return res.formatter.ok('Đăng xuất thành công')
    }

    return res.formatter.unprocess()
  }
}