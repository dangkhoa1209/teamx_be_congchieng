import mongoose from 'mongoose'


const oauthTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
  accessToken: String,
  accessTokenExpiresAt: Date,
  scope: String
});

export default mongoose.model('OAuthToken', oauthTokenSchema, 'teamx_oauth_tokens');
