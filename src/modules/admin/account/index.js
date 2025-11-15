import { UserModel } from "#models/index.js"

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
    
  

  
}