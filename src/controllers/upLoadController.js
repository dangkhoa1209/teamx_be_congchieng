import {upload} from '#plugins/index.js'

export class upLoadController {
    async add(req, res) {
      console.log('req', req.file)

      console.log('upload(req.file.file2)', await upload(req.file.file2, {
        dest: '/khoa/'
      }));
      
      res.send('s')
    }
}