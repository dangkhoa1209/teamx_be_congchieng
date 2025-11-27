import { FeaturedNewsModel , NewsModel } from "#models/index.js"

export default class AdminFeaturedNewsModule {
  update = async (req, res) => {
    try {
      console.log('req', req.body);
      
      const { position, newsId, type } = req.body

      if (!position || position < 1 || position > 4) {
        return res.formatter.badRequest('Vị trí phải từ 1 đến 4')
      }

      if (!newsId || newsId === 'null' || newsId === 'undefined') {
        return res.formatter.badRequest('Vui lòng chọn bài viết')
      }

      const news = await NewsModel
        .findOne({ _id: newsId, status: 'active' })
        .select('title subtitle slugify thumbnail location createdAt')
        .lean()

      if (!news) {
        return res.formatter.notFound('Bài viết không tồn tại hoặc chưa được duyệt')
      }

    const result = await FeaturedNewsModel.findOneAndUpdate(
        { type, position },                          // tìm theo type + position
        {
          $set: {
            newsId,
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )
      
      return res.formatter.ok(result)

    } catch (error) {
      
      return res.formatter.unprocess('Có lỗi xảy ra khi cập nhật tin nổi bật')
    }
  }
  // get by type
  // GET: Lấy 4 tin nổi bật (trang chủ hoặc bất kỳ type nào)

  get = async (req, res) => {
    try {
      const { type  } = req.body      

      const items = await FeaturedNewsModel
        .find({ type })
        .populate({
          path: 'news',
        })
        .sort({'position': 1})
        .limit(4)
        .lean()


      return res.formatter.ok(items)
    } catch (error) {
      console.log('errr', error);
      
      return res.formatter.ok([])
    }
  }


  
}