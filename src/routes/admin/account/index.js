import { authRouter } from '#plugins/index.js'
import { AdminAcountModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  
  router.post('/save', new AdminAcountModule().save)
  router.post('/list', new AdminAcountModule().list)

  return router
}
