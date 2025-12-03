import { authRouter } from '#plugins/index.js'
import { AdminPageImageModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  
  router.post('/', new AdminPageImageModule().update)
  router.post('/get', new AdminPageImageModule().get)
  
  
  return router
}
