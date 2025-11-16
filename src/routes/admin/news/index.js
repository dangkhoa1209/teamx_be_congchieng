import { authRouter } from '#plugins/index.js'
import { AdminNewsModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  
  router.post('/', new AdminNewsModule().create)
  router.post('/list', new AdminNewsModule().list)
  router.put('/:id', new AdminNewsModule().update)
  
  return router
}
