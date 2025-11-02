import { authRouter } from '#plugins/index.js'
import { UserModule } from '#modules/index.js'
export default (app) => {
  const router = authRouter(app)
  router.get('/', new UserModule().getUser)
  router.put('/change-password', new UserModule().changePassword)
  // router.get('/find', findUser)
  // router.get('invite-user/', inviteUser)
  // // router.put('/', editInfo)
 
  router.get('/logout', new UserModule().logout)
  // router.delete('/delete-account', deleteAccount)

  return router
}
