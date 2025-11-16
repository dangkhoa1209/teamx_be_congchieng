import { authRouter } from '#plugins/index.js'
import { AdminNewsModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  
  router.post('/', new AdminNewsModule().create)
  
  return router
}
