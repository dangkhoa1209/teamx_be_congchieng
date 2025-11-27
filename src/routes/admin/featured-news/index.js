import { authRouter } from '#plugins/index.js'
import { AdminFeaturedNewsModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  router.post('/', new AdminFeaturedNewsModule().update)
  router.post('/get', new AdminFeaturedNewsModule().get)
  return router
}
