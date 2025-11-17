import { NewsModel  } from "#models/index.js"
import {upload, slugifyFn} from '#plugins/index.js'

export default class AdminNewsModule {
  create = async (req, res) => {
    let contents = JSON.parse(req.body.contents)

    const hasContent = contents.some(c => c.type === 'content')
    const hasImage = contents.some(c => c.type === 'image')

    if (!hasContent) {
      return res.formatter.badRequest('Vui lòng thêm ít nhất 1 nội dung.')
    }
    if (!hasImage) {
      return res.formatter.badRequest('Vui lòng thêm ít nhất 1 hình ảnh.')
    }

    // Upload ảnh và thêm metadata
    contents = await Promise.all(
      contents.map(async (content) => {
        if (content.type === 'content') {
          return content
        }

        const imageFile = req.file?.[`image_${content.id}`]
        if (!imageFile) throw new Error(`Vui lòng chọn hình ảnh`) 
          
          console.log('imageFile', imageFile);
          
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
      status: req.body.status
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
        if (content.type === 'content') {
          return content
        }

        if(content.url){
          return content
        }

        const imageFile = req.file?.[`image_${content.id}`]
        if (!imageFile) throw new Error(`Vui lòng chọn hình ảnh`) 
          
          console.log('imageFile', imageFile);
          
        const uploaded = await upload(imageFile, { dest: '/tin-tuc-su-kien/' })
        content.size = uploaded.size
        content.fileName = uploaded.fileName
        content.mimeType = uploaded.mimeType
        content.url = uploaded.url

        delete content.image

        return content
      })
    )

    const slugify = slugifyFn(req.body.title)

    const existSlug = await NewsModel.findOne({
      slugify,
      _id: { $ne: req.params.id }
    })

    if(existSlug) {
      return res.formatter.unprocess('Tiêu đề đã đuợc sử dụng. Vui lòng thay đổi để tiếp tục')
    }
    news.location = req.body.location
    news.slugify = slugify
    news.title = req.body.title
    news.subtitle = req.body.subtitle
    news.contents = contents
    news.status = req.body.status
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
    console.log('query', query);
    
    const data = await NewsModel.find(query)
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: -1 })
    return res.formatter.ok({
      data,
      currentPage: page,
      size: per_page,
      totalItems
    })
    return res.json()
  }

}