import mongoose from 'mongoose'
import {removeVietnameseTones} from '#plugins/index.js'

const newsSchema = new mongoose.Schema({
  slugify: {type: String},
  title: { type: String, require: true },
  subtitle: { type: String, require: true },
  status: {type: String, default: 'unactive'},
  contents: {
    type: Array,
    require: true
  },
  search: {
    type: 'String',
  },
  createdAt: { type: Number },
  updatedAt: { type: Number }
})

newsSchema.pre('save', async function (next) {
  const now = Date.now()
  if (!this.createdAt) this.createdAt = now
  this.updatedAt = now

  // thumbnail
  const firstImage = this.contents.find(c => c.type === 'image')
  this.thumbnail = firstImage ? firstImage.url : ''

  // data search  (titel + subtitle)
  const rawSearch = `${req.body.title} ${req.body.subtitle}`
  this.search = cleanString(removeVietnameseTones(rawSearch))
  next()
})

newsSchema.methods.validatePassword = function (password) {  
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('News', newsSchema, 'teamx_news')
