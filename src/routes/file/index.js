import express from 'express'
import { FileController } from '#controllers/fileController.js'

const router = express.Router()

router.get('/:pathname', new FileController().get)
router.get('/:path1/:pathname', new FileController().get)
router.get('/:path1/:path2/:pathname', new FileController().get)
router.get('/:path1/:path2/:path3/:pathname', new FileController().get)

export default router
