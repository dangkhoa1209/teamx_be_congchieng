import mongoose from 'mongoose'
import {removeVietnameseTones} from '#plugins/index.js'

const newsSchema = new mongoose.Schema({
  slugify: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unactive'],
    default: 'unactive'
  },
  contents: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    default: []
  },
  search: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  }
}, {
  timestamps: true,
  collection: 'teamx_news',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

newsSchema.index({ slugify: 1 }, { unique: true })
newsSchema.index({ search: "text" }) 
newsSchema.index({ status: 1, createdAt: -1 })
newsSchema.index({ location: 1 })
newsSchema.index({ status: 1, createdAt: -1 })
newsSchema.index({ author: 1 })

newsSchema.pre('save', async function (next) {
  // thumbnail
  const firstImage = this.contents.find(c => c.type === 'image')
  this.thumbnail = firstImage ? firstImage.url : ''

  // data search  (titel + subtitle)
  const rawSearch = `${this.title} ${this.subtitle}`
  this.search = removeVietnameseTones(rawSearch)
  next()
})

newsSchema.methods.validatePassword = function (password) {  
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('News', newsSchema, 'teamx_news')