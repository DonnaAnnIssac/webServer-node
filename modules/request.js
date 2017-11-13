class Request {
  constructor (reqObj, handlers) {
    this.method = reqObj.Method
    this.url = reqObj.Path
    this.version = reqObj.Version
    this.headers = reqObj.Headers
    this.body = ''
    this.handlers = [...handlers]
  }
}

module.exports = Request
