export default (module) => ({
  getAll: (req, res) => module.getAll(res, req.body),
  getById: (req, res) => module.getById(res, req.params.id),
  create: (req, res) => module.create(res, req.body),
  update: (req, res) => module.update(res, req.params.id, req.body),
  delete: (req, res) => module.delete(res, req.params.id),
})
