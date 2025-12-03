import { guestRouter } from '#plugins/index.js'
import { PageImageModule } from '#modules/index.js'
export default (app) => {  
  const router = guestRouter(app)
  router.post('/get', new PageImageModule().get)
  return router
}

