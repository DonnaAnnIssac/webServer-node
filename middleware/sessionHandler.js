let uuid = require('uuid')

const Session = {}

const handleSession = (req, res, next) => {
  if (!cookieExists) createSession(res)
  next(req, res)
}

const createSession = (res) => {
  let id = uuid()
  Session[id] = {}
  res.headers['Set-Cookie'] = id
}

const addSession = (req, data) => {
  if (cookieExists) Session[req.headers]['Cookie'] = data
}
const getSession = (req) => {
  return (cookieExists) ? Session[req.headers['Cookie']] : undefined
}

const deleteSession = (req) => {
  if (cookieExists) delete Session[req.headers['Cookie']]
}

const cookieExists = (req) => {
  return (Session.hasOwnProperty(req.headers['Cookie']) && req.headers['Cookie'])
}
module.exports = {handleSession, addSession, getSession, deleteSession}
