const routes = require('./router')
const fs = require('fs')

const getHandler = (req, res, socket, next) => {
  console.log('Inside GET Handler\n')
  fs.readFile(routes(req.url), (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.setStatus(404)
        res.body = res.statusCode + ' ' + res.statusMessage
        writeToSocket(res.generateResStr(), res, socket)
        return
      }
      res.setStatus(500)
      res.body = res.statusCode + ' ' + res.statusMessage
      writeToSocket(res.generateResStr(), res, socket)
      return
    } else if (data === undefined) {
      res.setStatus(400)
      res.body = res.statusCode + ' ' + res.statusMessage
      writeToSocket(res.generateResStr(), res, socket)
      return
    }
    res.body = data
    res.headers['Content-Length'] = res.body.byteLength
    res.setContentType(routes(req.url))
    writeToSocket(res.generateResStr(), res, socket)
  })
}

function writeToSocket (str, response, socket) {
  socket.write(str, (err) => {
    if (err) console.log('ERR IN WRITE:', err)
    socket.write(response.body, err => {
      if (err) console.log('ERR IN WRITE:', err)
      console.log('Write complete')
      if (response.headers['Connection'] === 'close') socket.destroy()
    })
  })
}

module.exports = getHandler
