import { NewsModel, FeaturedNewsModel } from "#models/index.js"
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
      return res.formatter.ok([])
    }
  }

  other = async (req, res) => {
    try{
      let { exclude, location, limit, newsLastId } = req.body;
      let exc = [];

      

      if (exclude) {
        exc = exclude.filter((item) => item);
      }      

      let typeFeaturedNews = 'tin-tuc-su-kien';
      if (location) {
        typeFeaturedNews = location;
      }

      const featuredNews = await FeaturedNewsModel
        .find({ type: typeFeaturedNews }) // dùng typeFeaturedNews thay vì location
        .limit(4)
        .lean();

      if (featuredNews && featuredNews.length) {
        exc.push(...featuredNews.map((item) => item.newsId));
      }

      const options = {
        status: 'active'
      }
      if(location){
        options.location = location
      }
      if(exc.length){
        options._id = { $nin: exc }   
      }      

      if (newsLastId) {
        options._id.$lt = newsLastId;
      }
      
      const newsList = await NewsModel.find(options)
       .sort({ createdAt: -1 }) 
      .limit(limit || 10)
      .lean(); 

      return res.formatter.ok(newsList)
    }catch(e) {
      console.log('e', e);
      
      return res.formatter.ok([])
    }
  };

  list = async (req, res) => {
  try {
    let { filter, lastId = null, perPage = 18 } = req.body;

    perPage = parseInt(perPage);
    if (perPage < 1) perPage = 10;

    const { location } = filter || {};

    if (location) {
      options.location = location;
    }

    if (lastId) {
      options._id = { $lt: lastId }; 
    }

    const news = await NewsModel.find(options)
      .limit(perPage)
      .sort({ _id: -1 });

    const newLastId = news.length ? news[news.length - 1]._id : null;

    return res.formatter.ok({
      data: news,
      perPage,
      lastId: newLastId
    });

  } catch (err) {
    return res.formatter.ok([]);
  }
};


}