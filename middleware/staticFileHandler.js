const fs = require('fs')
const path = require('path')

function staticFileHandler (directory) {
  return (req, res, next) => {
    req.url = resolvePath(req.url, directory)
    fs.readFile(req.url, (err, data) => {
      if (err) {
        req.url = req.url.slice(directory.length)
        next(req, res)
        return
      }
      res.body = data
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
