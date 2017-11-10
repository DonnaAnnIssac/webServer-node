class Request {
  constructor (reqObj, handlers) {
    this.method = reqObj.Method
    this.url = parseUrl(reqObj.Path)
    this.version = reqObj.Version
    this.headers = reqObj.Headers
    this.body = ''
    this.handlers = [...handlers]
  }
}

function parseUrl (url) {
  let i = url.indexOf('?')
  return (i !== -1) ? url.slice(0, i) : url
}

module.exports = Request
