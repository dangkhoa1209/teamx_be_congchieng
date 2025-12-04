import { FeaturedNewsModel , NewsModel } from "#models/index.js"

export default class FeaturedNewsModule {
  get = async (req, res) => {
    try {
      console.log('sdfs');
      
      const { type , exclude } = req.body      
          
       let exc = [];
       if (exclude) {
        exc = exclude.filter((item) => item);
      }   
      
      const options = {
        type: type
      }

      if(exc.length){
        options.newsId = { $nin: exc }   
      }    

     
      


      const items = await FeaturedNewsModel
        .find(options)
        .populate({
          path: 'news',
        })
        .sort({'position': 1})
        .limit(4)
        .lean()

         console.log('items', items);

        
      return res.formatter.ok(items)
    } catch (error) {     
      console.log('err', error);
       
      return res.formatter.ok([])
    }
  }


  
}