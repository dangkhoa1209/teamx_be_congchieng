import mongoose from 'mongoose'

const oauthRefreshTokenSchema = new mongoose.Schema({
  accessToken: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthToken' },
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  scope: String
});
export default mongoose.model('OAuthRefreshToken', oauthRefreshTokenSchema, 'teamx_oauth_refresh_tokens');
