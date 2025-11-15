import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  isAdmin: { type: Boolean },
  permissions: { type: Array }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.validatePassword = function (password) {  
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema, 'teamx_users')
