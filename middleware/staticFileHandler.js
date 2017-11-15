const fs = require('fs')
const path = require('path')

function staticFileHandler (directory) {
  return (req, res, next) => {
    if (req.method === 'POST') {
      next(req, res)
      return
    }
    fs.readFile(resolvePath(req.url, directory), (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          next(req, res)
          return
        } else throw err
      }
      res.body = data
      res.setHeaders()
      res.setContentType(req.url)
      res.send()
    })
  }
}

function resolvePath (url, directory) {
  let ext = path.extname(url)
  return (url === '/')
  ? directory + '/index.html' : (ext.length === 0)
  ? directory + url + '.html' : directory + url
}

module.exports = staticFileHandler
