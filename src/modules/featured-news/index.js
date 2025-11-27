import { FeaturedNewsModel , NewsModel } from "#models/index.js"

export default class FeaturedNewsModule {
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
      return res.formatter.ok([])
    }
  }


  
}