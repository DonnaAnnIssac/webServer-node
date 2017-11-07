const getHandler = require('./get-handler')
const postHandler = require('./post-handler')

const chooseMethod = (req, res, socket, next) => {
  if (req.method === 'GET') getHandler(req, res, socket, next)
  if (req.method === 'POST') postHandler(req, res, next)
}

module.exports = chooseMethod
