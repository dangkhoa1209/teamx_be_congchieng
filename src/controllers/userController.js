export const getUsers = (req, res) => {

  console.log('reqfile', req.file);
  console.log('reqfiles', req.files);
  
  
  return res.formatter.ok([
    { id: 1, name: 'Khoa' },
    { id: 2, name: 'fdg' }
  ])
}
