const bodyParser = (req, body) => {
  if (req.headers['Content-Type'] === ' application/x-www-form-urlencoded') {
    let values = body.split('&')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split('=')[0]] = element.split('=')[1].replace('+', ' ')
    })
    req.body = parsedBody
  }
}

module.exports = bodyParser
