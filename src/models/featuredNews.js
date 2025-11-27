
import mongoose from 'mongoose'
import {removeVietnameseTones} from '#plugins/index.js'

const featureNewsSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Types.ObjectId,
    ref: 'News',
    required: true
  },
  position: {
    type: Number,
    required: true,
    min: [1, 'Vị trí phải từ 1 đến 4'],
    max: [4, 'Vị trí chỉ được tối đa 4']
  },
  type: {
    type: String,
    required: true,
    enum: ['tin-tuc-su-kien', 'tech', 'sport', 'entertainment', 'business'], // thêm loại tùy bạn
    default: 'tin-tuc-su-kien'
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

featureNewsSchema.virtual('news', {
  ref: 'News',
  localField: 'newsId',
  foreignField: '_id',
  justOne: true
})

featureNewsSchema.index({ type: 1, position: 1 }, { unique: true })

featureNewsSchema.index({ type: 1 })

export default mongoose.model('FeatureNews', featureNewsSchema, 'teamx_feature_news')
