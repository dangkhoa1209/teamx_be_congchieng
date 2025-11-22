import { guestRouter } from '#plugins/index.js'
import { NewsModule } from '#modules/index.js'
export default (app) => {  
  const router = guestRouter(app)
  router.post('/', new NewsModule().detail)
  router.post('/find', new NewsModule().find)

  return router
}

