import { FileModule } from '#modules/index.js'
import { guestRouter } from '#plugins/index.js'

export default (app) => {  
  const router = guestRouter(app)

  router.get('/:pathname', new FileModule().get)
  router.get('/:path1/:pathname', new FileModule().get)
  router.get('/:path1/:path2/:pathname', new FileModule().get)
  router.get('/:path1/:path2/:path3/:pathname', new FileModule().get)
  router.get('/:path1/:path2/:path3/:path4/:pathname', new FileModule().get)
  
  return router
}
