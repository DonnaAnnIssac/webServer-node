# webServer-node <hr>
An HTTP server library written using Node.js net module 

# Installation <hr>
Before installing, download and install Node.js 
Run the following commands on a terminal to install Node.js

sudo apt-get update

sudo apt-get install nodejs

sudo apt-get install npm

Now that Node.js and npm is successfully installed, install http-server-lib from npm by using npm install command

npm install http-server-lib

Running this will create a node modules directory in your current directory (if one doesn't exist yet) and download the package in that directory.

# Getting Started <hr>
> Create an app.js file and create the server instance by specifying a port number to listen to. 

const server = require('./server/tcp-server')
server.startServer(port)

> To add routes, call the addRoutes method on the server instance and pass it a callback that describes what the server should do upon receiving a request to that route

server.addRoutes(method, path, callback)

The callback accepts two arguments - a request and response object

> To use any of the middlewares, call the addHandler method on the server instance

server.addHandler(logger)

Note: Middlewares are processed in the order that they are added

# Features <hr>

> Static file handling
> Session handling
> Body parsing with support for multipart/form-data and multipart/mixed type requests
