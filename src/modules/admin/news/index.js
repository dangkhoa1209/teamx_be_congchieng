import { NewsModel  } from "#models/index.js"
import {upload, slugifyFn, convertToTimestamp} from '#plugins/index.js'

export default class AdminNewsModule {
  create = async (req, res) => {
    let contents = JSON.parse(req.body.contents)

    const hasContent = contents.some(c => c.type === 'content')
    const hasImage = contents.some(c => c.type === 'image')

    if (!hasContent) {
      return res.formatter.unprocess('Vui lòng thêm ít nhất 1 nội dung.')
    }
    if (!hasImage) {
      return res.formatter.unprocess('Vui lòng thêm ít nhất 1 hình ảnh.')
    }

    if (!req.body.location){
      return res.formatter.unprocess('Vui lòng chọn trực thuộc.')
    }

    // Upload ảnh và thêm metadata
    contents = await Promise.all(
      contents.map(async (content) => {
        if (content.type != 'image') {
          return content
        }        
        const imageFile = req.file?.[`image_${content.id}`]
        if (!imageFile) throw new Error(`Vui lòng chọn hình ảnh`)           
        const uploaded = await upload(imageFile, { dest: '/tin-tuc-su-kien/' })
        content.size = uploaded.size
        content.fileName = uploaded.fileName
        content.mimeType = uploaded.mimeType
        content.url = uploaded.url
        delete content.image

        return content
      })
    )

    // Slug
    const slugify = slugifyFn(req.body.title)

    const existSlug = await NewsModel.findOne({ slugify })

    if(existSlug) {
      return res.formatter.unprocess('Tiêu đề đã đuợc sử dụng. Vui lòng thay đổi để tiếp tục')
    }

    const data = {
      location: req.body.location,
      slugify,
      title: req.body.title,
      subtitle: req.body.subtitle,
      contents,
      status: req.body.status,
      author: req.body.author
    }    

    const newNews = new NewsModel(data)
    await newNews.save()

    return res.formatter.ok()
    
  }

  update = async (req, res) => {
    const { id } =  req.params
    const news = await NewsModel.findById(id)

    if(!news) {
      return res.formatter.unprocess('Không tìm thấy bài viết')
    }

    let contents = JSON.parse(req.body.contents)

    const hasContent = contents.some(c => c.type === 'content')
    const hasImage = contents.some(c => c.type === 'image')

    if (!hasContent) {
      return res.formatter.badRequest('Vui lòng thêm ít nhất 1 nội dung.')
    }
    if (!hasImage) {
      return res.formatter.badRequest('Vui lòng thêm ít nhất 1 hình ảnh.')
    }

     contents = await Promise.all(
      contents.map(async (content) => {
        if (content.type != 'image') {
          return content
        }

        if(content.url){
          return content
        }

        const imageFile = req.file?.[`image_${content.id}`]
        if (!imageFile) throw new Error(`Vui lòng chọn hình ảnh`)           
        const uploaded = await upload(imageFile, { dest: '/tin-tuc-su-kien/' })
        content.size = uploaded.size
        content.fileName = uploaded.fileName
        content.mimeType = uploaded.mimeType
        content.url = uploaded.url

        delete content.image

        return content
      })
    )

    // có thay đôi tiêu đề thi tao slug moi
    if(req.body.title != news.title) {

      const slugify = slugifyFn(req.body.title)

      const existSlug = await NewsModel.findOne({
        slugify,
        _id: { $ne: req.params.id }
      })

      if(existSlug) {
        return res.formatter.unprocess('Tiêu đề đã đuợc sử dụng. Vui lòng thay đổi để tiếp tục')
      }

      news.slugify = slugify
    }

    news.location = req.body.location
    news.title = req.body.title
    news.subtitle = req.body.subtitle
    news.contents = contents
    news.status = req.body.status
    news.author = req.body.author
    news.markModified('contents')

    await news.save()

    return res.formatter.ok()
  }

  list = async (req, res) => {
    let { page = 1, per_page = 10, query} = req.body
    page = parseInt(page)
    per_page = parseInt(per_page)
    if (page < 1) page = 1
    if (per_page < 1) per_page = 10
    const totalItems = await NewsModel.countDocuments()
        
    const data = await NewsModel.find({})
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: -1 })
      
    return res.formatter.ok({
      data,
      currentPage: page,
      size: per_page,
      totalItems
    })
  }

  deleteNews = async (req, res) => {
    const { _id } = req.body;

    const news = await NewsModel.findById(_id);

    if (!news) {
      return res.formatter.unprocess('Không tìm thấy tin tức - sự kiện');
    }

    await news.deleteOne();

    return res.formatter.ok();
  }
}