import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OAuthClient from '#models/oauth/oAuthClient.js';
import { UserModel } from "#models/index.js"
dotenv.config();

import {connectionString} from "#config/index.js"

async function init() {
  try {
    await mongoose.connect(connectionString);

    // create client
    const existingClient = await OAuthClient.findOne({});
    if (existingClient) {
      console.log('Exist client:', existingClient);
    } else {
      const newClient = new OAuthClient({
        secret: 'demo-secret',
        grants: ['password', 'refresh_token']
      });
      await newClient.save();
      console.log('New client:', newClient);
    }

    // create user 
    const existAdmin = await UserModel.findOne({username: 'admin'});
    if(existAdmin){
      existAdmin.password = process.env.ADMIN_DEFAULT_PW || '123456'
      existAdmin.isAdmin = true
      await existAdmin.save()
      console.log('update admin success');
    }else{
      const newAdmin = new UserModel({
        username: 'admin',
        password: process.env.ADMIN_DEFAULT_PW || '123456',
        isAdmin: true
      });
      await newAdmin.save()
      console.log('create admin success'); 
    }

  } catch (err) {
    console.error('error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

init();
