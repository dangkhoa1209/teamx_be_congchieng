import mongoose from 'mongoose';

const oauthClientSchema = new mongoose.Schema({
  secret: String,
  grants: [String]
});

const OAuthClient = mongoose.model('OAuthClient', oauthClientSchema, 'teamx_oauth_clients');

export default OAuthClient;
