import express from 'express'
import middlewareRequest from '#middlewares/formatRequest.js'
import setAuthUser from '#middlewares/setAuthUser.js'
export const authRouter = (app) => {
  const temp = express.Router()
  temp.use((req, res, next) => setAuthUser(app, req, res, next))
  temp.use(middlewareRequest)
  return temp
}


export const guestRouter = (app) => {
  const temp = express.Router()
  temp.use(middlewareRequest)
  return temp
}


