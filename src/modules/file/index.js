import {resFile} from '#plugins/index.js'

export default class FileModule {
  async get(req, res) {
    return resFile(req, res)
  }
}
