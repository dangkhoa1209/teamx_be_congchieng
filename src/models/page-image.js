
import mongoose from 'mongoose'

const pageImageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  size: Number,
  fileName: String,
  mimeType: String,
  url: {
    type: String,
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default mongoose.model('PageImage', pageImageSchema, 'teamx_page_images')