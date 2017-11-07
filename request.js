const parseRequest = require('./parseRequest')
const getHandler = require('./get-handler')
const postHandler = require('./post-handler')

let handlers = [
  getHandler,
  postHandler
]

class Request {
  constructor (reqStr) {
    this.method = ''
    this.url = ''
    this.version = ''
    this.headers = {}
    this.body = ''
    this.handlers = [...handlers]
    requestParser(reqStr, this)
  }
}

function requestParser (reqStr, request) {
  parseRequest(reqStr, request)
}

module.exports = Request
