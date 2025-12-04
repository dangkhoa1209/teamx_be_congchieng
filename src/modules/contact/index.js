
import  sendContactMail from '../../services/mailService.js'



export default class ContactModule {
  request = async (req, res) => { 
    const result = await sendContactMail(req.body);
    if (result.success) {
      res.formatter.ok()
    } else {
      res.formatter.unprocess('Gửi thông tin không thành công') 
    }
  }
}