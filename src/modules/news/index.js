import { NewsModel  } from "#models/index.js"
import {convertToTimestamp} from '#plugins/index.js'

export default class NewsModule {
  detail = async (req, res) => { 
    const {
      slugify
    }  = req.body    

    const news = await NewsModel.findOne({slugify, status: 'active'})
    
    return res.formatter.ok(news)
  }

  find = async (req, res) => {
    try {      
      let { filter, page = 1, perPage = 10 } = req.body      

      page = parseInt(page)
      perPage = parseInt(perPage)
      if (page < 1) page = 1
      if (perPage < 1) perPage = 10

      const {search, location, time} = filter

      const regex = new RegExp(search.replace(/\s+/g, '.*'), 'i');

      const options = {
        $or: [
          { search: regex },
          { slugify: regex },
          { title: regex },
          { subtitle: regex }
        ],
        status: 'active'
      }

      if(location) {
        options.location = location
      }

     
      
      if(time) {
        const value = convertToTimestamp(time)

         console.log('value', value);
        options.createdAt = {
          $gte: value
        }
      }      

      const news = await NewsModel.find(options)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })

      const totalItems = await NewsModel.countDocuments(options)

      return res.formatter.ok({
        data: news,
        page: page,
        perPage: perPage,
        total: totalItems
      })
    } catch (err) {
      console.log(err);
      
      res.status(500).json({ error: err.message });
    }
  }


}