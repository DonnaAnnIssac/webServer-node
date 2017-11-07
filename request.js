const parseRequest = require('./parseRequest')
const methods = require('./method')
const logger = require('./logger')

let handlers = [
  logger,
  methods
  // bodyParser
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
