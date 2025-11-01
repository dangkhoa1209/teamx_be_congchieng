import path from 'path'
import fs from 'fs'
import {readFile, resFile} from '#plugins/index.js'

export class FileController {
  async get(req, res) {
    try {
      resFile(req, res)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Lỗi server' })
    }
  }
}
