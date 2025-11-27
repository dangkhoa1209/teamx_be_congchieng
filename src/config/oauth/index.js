import User from "#models/user.js";
import OAuthToken from '#models/oauth/oAuthToken.js'
import OAuthRefreshToken from '#models/oauth/oAuthRefreshToken.js'
import OAuthClient from '#models/oauth/oAuthClient.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const OAuthModel = {
  getClient: async (clientId, clientSecret) => {

      const client = await OAuthClient.findOne({ _id: clientId, secret: clientSecret });      
      if (!client) return null;

      return client
  },
  getUser: async (username, password) => {    
    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+password');
    
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Tài khoản hoặc mật khẩu không khớp!');
    }
    return user;
  },
  generateAccessToken: async (client, user, scope) => {
    const tokenId = crypto.randomUUID();
    const jwtSecretKey = process.env.APP_KEY || 'secret';
    const data = { userId: user._id, tokenId, time: Date() };
    return { tokenId, code: jwt.sign(data, jwtSecretKey, { expiresIn: '1h' }) };
  },
  generateRefreshToken: async (client, user, scope) => {
    const tokenId = crypto.randomBytes(20).toString('hex');
    const jwtSecretKey = process.env.APP_KEY || 'secret';
    const data = { userId: user._id, tokenId, time: Date() };
    return { tokenId, code: jwt.sign(data, jwtSecretKey, { expiresIn: '90d' }) };
  },
  saveToken: async (token, client, user) => {
    const accessToken = await OAuthToken.create({
      user: user._id,
      client: client._id,
      accessToken: token.accessToken.tokenId,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scope
    });
    await OAuthRefreshToken.create({
      user: user._id,
      client: client._id,
      accessToken: accessToken._id,
      refreshToken: token.refreshToken.tokenId,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope
    });
    
    return {
      accessToken: token.accessToken.code,
      refreshToken: token.refreshToken.code,
      accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
      user: { id: user._id, username: user.username, isAdmin: user.isAdmin, permissions: user.permissions },
      client: { id: client._id },
    };
  },
  getAccessToken: async (accessToken) => {
    const jwtSecretKey = process.env.APP_KEY || 'secret';
    try {
      const verified = jwt.verify(accessToken, jwtSecretKey);
      const token = await OAuthToken.findOne({ accessToken: verified.tokenId }).populate('user').populate('client');
      return token?.toObject() || null;
    } catch(e) { return null; }
  },
  getRefreshToken: async (refreshToken) => {
    const jwtSecretKey = process.env.APP_KEY || 'secret';
    try {
      const verified = jwt.verify(refreshToken, jwtSecretKey);
      
     const token = await OAuthRefreshToken.findOne({ refreshToken: verified.tokenId })
      .populate('client')
      .populate('user')
      .populate({
        path: 'accessToken',
        populate: [
          { path: 'client' },
          { path: 'user' }
        ]
      })      
      return {
        ...token._doc,
        token: token.accessToken
      }
    } catch(e){
      console.log('error', e);
      return null;
    }
  },
  revokeToken: async (refreshToken) => {
    const jwtSecretKey = process.env.APP_KEY || 'secret';
    try {      
      if(typeof refreshToken == 'string') {
        const verified = jwt.verify(refreshToken, jwtSecretKey);
        const token = await OAuthRefreshToken.findOne({ refreshToken: verified.tokenId });        
        if(token) {
          await OAuthToken.deleteOne({ _id: token.accessToken });
          await token.deleteOne();
          return true;
        }
      }else {
        await OAuthToken.deleteOne({ _id: refreshToken.token._id });
        await OAuthRefreshToken.deleteOne({ _id: refreshToken._id });
        return true
      }
      
      return false;
    } catch(e){ 
      console.log('error', e);
      
      return false; 
    }
  }
}; 


export default OAuthModel