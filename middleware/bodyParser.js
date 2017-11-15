const bodyParser = (req, res, next) => {
  if (req.headers['Content-Type'] === ' application/x-www-form-urlencoded') {
    let values = req.body.split('&')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split('=')[0]] = element.split('=')[1].replace('+', ' ')
    })
    req.body = parsedBody
    next(req, res)
  } else if (req.headers['Content-Type'] === ' application/json') {
    let values = req.body.slice(1, req.body.length - 3).split(',')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split(':')[0].trim()] = element.split(':')[1].trim()
    })
    req.body = parsedBody
    next(req, res)
  } else next(req, res)
}

module.exports = bodyParser
