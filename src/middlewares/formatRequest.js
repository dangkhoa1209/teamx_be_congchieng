export default (req, res, next) => {
  const data = req.body

  if(!data){
    return next()
  }
  
  Object.assign(req.body, trimPostField(data))
  Object.assign(req.query, trimPostField(req.query))
  return next()
}

const trimPostField = (data) => {
  if (Array.isArray(data)) {
    return data.map((d) => {
      return trimPostField(d)
    })
  }
  if (typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      const trimData = data[key]
      if (trimData === undefined || trimData === null) {
        data[key] = trimData
      } else if (Array.isArray(trimData)) {
        data[key] = trimData.map((o) => {
          return trimPostField(o)
        })
      } else if (typeof trimData === 'object') {
        data[key] = trimPostField(trimData)
      } else if (typeof trimData === 'string') {
        data[key] = trimData.trim()
      } else {
        data[key] = trimData
      }
    })
    return data
  }
  if (typeof data === 'string') {
    return data.trim()
  }
  return data
}