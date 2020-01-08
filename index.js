const express = require('express')
const frontendRouter = require('./routes/frontend')
const PORT = 8000

const app = express()

/*
 * Routes configuration
 */
app.use(frontendRouter)

/*
 * Start listening
 */
app.listen(PORT, () => {
  console.log('Server listening on port', PORT)
})