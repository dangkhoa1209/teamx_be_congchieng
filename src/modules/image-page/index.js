import { PageImageModel } from "#models/index.js";

export default class PageImageModule {
  async get(req, res) {
    try {
      const pageImages = await PageImageModel.find();

      const result = {};
      
      pageImages.forEach(img => {
        result[img.type] = img.url;
      });

      return res.formatter.ok(result);
    } catch (error) {
      console.error(error);
      return res.formatter.ok({});
    }
  }
}
