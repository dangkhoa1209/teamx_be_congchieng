import { UserModel, OAuthClient, OAuthRefreshToken, OAuthToken  } from "#models/index.js"

export default class AdminAuthModule {

  create = async (req, res) => {
    console.log('req', req.body)
    console.log('req', req.files)
    console.log('req', req.file)
    return res.formatter.ok()
  }

  
}