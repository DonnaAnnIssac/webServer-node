const fs = require('fs')
const logger = (req, res, socket, next) => {
  let data = ''
  data += req.headers['Host'] + ' ' + new Date() + ' ' + req.method + ' ' + req.url + ' ' + req.version + '\n'
  fs.appendFile('./logs.txt', data, (err) => {
    if (err) throw err
    console.log('Log file updated')
    next(req, res, socket)
  })
}

module.exports = logger
