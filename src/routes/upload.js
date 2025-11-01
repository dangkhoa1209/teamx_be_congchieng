import express from 'express'
import {upLoadController} from '#controllers/upLoadController.js'

const router = express.Router()

router.post('/', new upLoadController().add)

export default router
