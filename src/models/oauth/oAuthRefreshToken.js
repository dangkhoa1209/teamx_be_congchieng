import mongoose from 'mongoose'

const oauthRefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
  accessToken: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthToken' },
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  scope: String
});
export default mongoose.model('OAuthRefreshToken', oauthRefreshTokenSchema, 'teamx_oauth_refresh_tokens');
