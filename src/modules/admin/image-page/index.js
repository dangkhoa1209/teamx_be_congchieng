

import { PageImageModel  } from "#models/index.js"
import {upload } from '#plugins/index.js'

export default class AdminPageImageModule {
  update = async (req, res) => {
    const type = req.body.type 
    if(!type) {
      res.formatter.unprocess('Lỗi lưu ảnh')
    }
     const uploaded = await upload(req.file.image, { dest: '/page-image/' })

     if(!uploaded){
        res.formatter.unprocess('Lỗi lưu ảnh')
     }

    const pageImage = await PageImageModel.findOne({type})
    if(pageImage) {
      pageImage.size = uploaded.size
      pageImage.fileName = uploaded.fileName
      pageImage.mimeType = uploaded.mimeType
      pageImage.url = uploaded.url
      await pageImage.save()
      return  res.formatter.ok()
    }

    
    const data = {
      type: type,
      size: uploaded.size,
      fileName: uploaded.fileName,
      mimeType: uploaded.mimeType,
      url: uploaded.url
    }    

    const newPageImage = new PageImageModel(data)
    await newPageImage.save()
    return res.formatter.ok()
  }

  get = async (req, res) => {
    const type = req.body.type 
    const pageImage = await PageImageModel.findOne({type})
    
    return  res.formatter.ok(pageImage)
  }
  // create = async (req, res) => {
  //   let contents = JSON.parse(req.body.contents)

  //   const hasContent = contents.some(c => c.type === 'content')
  //   const hasImage = contents.some(c => c.type === 'image')

  //   if (!hasContent) {
  //     return res.formatter.unprocess('Vui lòng thêm ít nhất 1 nội dung.')
  //   }
  //   if (!hasImage) {
  //     return res.formatter.unprocess('Vui lòng thêm ít nhất 1 hình ảnh.')
  //   }

  //   if (!req.body.location){
  //     return res.formatter.unprocess('Vui lòng chọn trực thuộc.')
  //   }

  //   // Upload ảnh và thêm metadata
  //   contents = await Promise.all(
  //     contents.map(async (content) => {
  //       if (content.type != 'image') {
  //         return content
  //       }        
  //       const imageFile = req.file?.[`image_${content.id}`]
  //       if (!imageFile) throw new Error(`Vui lòng chọn hình ảnh`)           
  //       const uploaded = await upload(imageFile, { dest: '/tin-tuc-su-kien/' })
  //       content.size = uploaded.size
  //       content.fileName = uploaded.fileName
  //       content.mimeType = uploaded.mimeType
  //       content.url = uploaded.url
  //       delete content.image

  //       return content
  //     })
  //   )

  //   // Slug
  //   const slugify = slugifyFn(req.body.title)

  //   const existSlug = await NewsModel.findOne({ slugify })

  //   if(existSlug) {
  //     return res.formatter.unprocess('Tiêu đề đã đuợc sử dụng. Vui lòng thay đổi để tiếp tục')
  //   }

  //   const data = {
  //     location: req.body.location,
  //     slugify,
  //     title: req.body.title,
  //     subtitle: req.body.subtitle,
  //     contents,
  //     status: req.body.status,
  //     author: req.body.author
  //   }    

  //   const newNews = new NewsModel(data)
  //   await newNews.save()

  //   return res.formatter.ok()
    
  // }
}