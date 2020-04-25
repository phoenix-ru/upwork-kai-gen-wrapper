const express = require('express')
const bodyParser = require('body-parser')
const MainRouter = require('./interface/routers/main.router')
const MasterApiRouter = require('./interface/routers/masterapi.router')
const PORT = 8000

const app = express()

/*
 * App configuration
 */

app.use(bodyParser.json())

/*
 * Routes configuration
 */
app.use(MainRouter)
app.use(MasterApiRouter)

/*
 * Start listening
 */
app.listen(PORT, () => {
  console.log('Server listening on port', PORT)
})
