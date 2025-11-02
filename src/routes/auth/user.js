import { authRouter } from '#plugins/index.js'
// import {
//   validate, getUser, changePassword, editInfo, logout, inviteUser, deleteAccount, findUser
// } from '@controllers/auth'

export default (app) => {
  const router = authRouter(app)
  router.get('/', (req, res) => {
    return res.formatter.ok(req.user)
  })
  // router.get('/find', findUser)
  // router.get('invite-user/', inviteUser)
  // // router.put('/', editInfo)
  // router.put('/change-password', validate.changePassword, changePassword)
  // router.post('/logout', logout)
  // router.delete('/delete-account', deleteAccount)

  return router
}
