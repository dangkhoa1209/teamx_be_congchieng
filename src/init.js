import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OAuthClient from '#models/oauth/oAuthClient.js';

dotenv.config();

import {connectionString} from "#config/index.js"

async function init() {
  try {
    await mongoose.connect(connectionString);

    const existingClient = await OAuthClient.findOne({});

    if (existingClient) {
      console.log(`✅ OAuthClient "${clientId}" already exists`);
    } else {
      const newClient = new OAuthClient({
        secret: 'demo-secret',
        grants: ['password']
      });
      await newClient.save();
    }

  } catch (err) {
    console.error('error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

init();
