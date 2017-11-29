# webServer-node
An HTTP server library written using Node.js net module 

# Installation
Before installing the library, [download and install Node.js and npm] (https://nodejs.org/en/download/)
Once Node.js and npm is successfully installed, install http-server-lib from npm by using npm install command

`$ npm install http-server-lib`

Running this will create a node modules directory in your current directory (if one doesn't exist yet) and download the package in that directory.

# Getting Started

Creating a server instance

```javascript
const server = require('./server/tcp-server')

server.startServer(port)
```

Adding routes 

```javascipt
const server = require('./server/tcp-server')

server.startServer(port)
server.addRoutes('GET', '/', (request, response) => {
  response.body = 'Hello World!'
  response.send()
})
```

Using middlewares

```javascript
const server = require('./server/tcp-server')
const logger = require('./middlewares/logger')
const bodyParser = require('./middlewares/bodyParser')

server.startServer(port)

server.addHandler(bodyParser.parseUrlEncodedBody)
server.addHandler(logger)

server.addRoutes('POST', '/data.html', (req, res) => {
  res.body = req.body['fieldName']
  res.setHeaders()
  res.setContentType('/data.html')
  res.send()
})
```

Note: Middlewares are processed in the order that they are added

# Features

Static file handling

Session handling

Body parsing with support for multipart/form-data and multipart/mixed type requests

Look [here] ('./app.js') for an example app that uses this library
