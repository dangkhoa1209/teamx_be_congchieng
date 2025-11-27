import { guestRouter } from '#plugins/index.js'
import { FeaturedNewsModule } from '#modules/index.js'
export default (app) => {
  const router = guestRouter(app)
  router.post('/get', new FeaturedNewsModule().get)
  return router
}
