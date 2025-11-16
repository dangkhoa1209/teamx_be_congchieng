import { authRouter } from '#plugins/index.js'
import { AdminAcountModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  
  router.post('/save', new AdminAcountModule().save)
  router.post('/list', new AdminAcountModule().list)
  router.post('/update-permission', new AdminAcountModule().updatePermission)
  router.post('/update-password', new AdminAcountModule().updatePassword)
  router.post('/delete', new AdminAcountModule().deleteUser)

  return router
}
