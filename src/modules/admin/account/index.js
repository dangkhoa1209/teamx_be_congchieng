import { UserModel, OAuthRefreshToken, OAuthToken  } from "#models/index.js"
import mongoose from 'mongoose'
export default class AdminAcountModule {

  save = async (req, res) => {    
    const {_id, username, password, permissions} = req.body

    const existAdmin = await UserModel.findOne({username});
    if(existAdmin){
      if(!_id || _id != existAdmin._id.toString()){
        return res.formatter.unprocess('Tài khoản đã tồn tại')
      }

      if(username == 'admin') {
        return res.formatter.unprocess('Không đuợc phép cập nhật Admin')
      }
      
      existAdmin.password = password
      existAdmin.permissions = permissions
      await existAdmin.save()
      return res.formatter.ok()
    }

    const newAdmin = new UserModel({
      username: username,
      password: password,
      permissions: permissions
    });
    await newAdmin.save()
    return res.formatter.ok()
  }

  list = async (req, res) => {
    let { page = 1, per_page = 10 } = req.body
    page = parseInt(page)
    per_page = parseInt(per_page)
    if (page < 1) page = 1
    if (per_page < 1) per_page = 10
    const totalItems = await UserModel.countDocuments()
    const data = await UserModel.find()
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: -1 })
      .select('-password')
    return res.formatter.ok({
      data,
      currentPage: page,
      size: per_page,
      totalItems
    })
    return res.json()
  }
    
  
  updatePermission = async (req, res) => {
    const {_id, permissions} = req.body

    const user = await UserModel.findById(_id);

    if(!user) {
      return res.formatter.unprocess('Không tìm thấy tài khoản')
    }

    if(user.isAdmin) {
      return res.formatter.unprocess('Không đuợc phép cập nhật Admin')
    }

    user.permissions = permissions
    await user.save()
    return res.formatter.ok()
  }
  

   updatePassword = async (req, res) => {
    const {_id, password} = req.body

    if(!password) {
      return res.formatter.unprocess('Mật khẩu không được để trống') 
    }

    const user = await UserModel.findById(_id);

    if(!user) {
      return res.formatter.unprocess('Không tìm thấy tài khoản')
    }

    if(user.username === 'admin') {
      return res.formatter.unprocess('Không đuợc phép cập nhật Admin')
    }

    user.password = password
    await user.save()
    return res.formatter.ok()
  }


  deleteUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { _id } = req.body;

      const user = await UserModel.findById(_id).session(session);

      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.formatter.unprocess('Không tìm thấy tài khoản');
      }

       if(user.isAdmin) {
        await session.abortTransaction();
        session.endSession();
        return res.formatter.unprocess('Không được phép xoá Admin');
      }

      // Xoá user
      await user.deleteOne({ session });

      // Xoá OAuth token
      await OAuthToken.deleteMany({ user: user._id }).session(session);

      // Xoá Refresh token
      await OAuthRefreshToken.deleteMany({ user: user._id }).session(session);

      await session.commitTransaction();
      session.endSession();

      return res.formatter.ok();

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.formatter.unprocess('Có lỗi xảy ra khi xoá tài khoản');
    }
  };


}