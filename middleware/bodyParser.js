const bodyParser = (req, body) => {
  if (req.headers['Content-Type'] === ' application/x-www-form-urlencoded') {
    let values = body.split('&')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split('=')[0]] = element.split('=')[1].replace('+', ' ')
    })
    req.body = parsedBody
  } else if (req.headers['Content-Type'] === ' application/json') {
    let values = body.slice(1, body.length - 3).split(',')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split(':')[0].trim()] = element.split(':')[1].trim()
    })
    req.body = parsedBody
  }
}

module.exports = bodyParser
