const fs = require('fs')
const path = require('path')

const staticFileHandler = (directory) => {
  return (req, res, next) => {
    let ext = path.extname(req.url)
    req.url = (req.url === '/')
    ? './test/index.html' : (ext.length === 0)
    ? directory + req.url + '.html' : directory + req.url
    fs.readFile(req.url, (err, data) => {
      if (err) throw err
      res.body = data
      res.setContentType(req.url)
      res.headers['Content-Length'] = data.byteLength
      res.send()
    })
  }
}

exports.module = staticFileHandler
