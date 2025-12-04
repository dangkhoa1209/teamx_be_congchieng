import { ContactModule } from '#modules/index.js'
import { guestRouter } from '#plugins/index.js'

export default (app) => {  
  const router = guestRouter(app)
  router.post('/request', new ContactModule().request)
  return router
}

