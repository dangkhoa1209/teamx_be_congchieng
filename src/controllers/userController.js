export const getUsers = (req, res) => {

  console.log('reqfile', req.file.a.v);
  console.log('reqfiles', req.files);
  
  
  return res.formatter.badRequest([
    { id: 1, name: 'Khoa' },
    { id: 2, name: 'fdg' }
  ])
}
