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
    
  

  
}