/*
 * Express router imports
 */

const express = require('express')
const router = express.Router()

/*
 * Internal dependencies
 */

const { respond } = require('../handlers/commons')
const { handleGenerate } = require('../handlers/generate.handler')

/*
 * Router configuration
 */

router.get('/', (req, res) => {
  respond(res, 'Application works, great!')
})

router.get('/generate', handleGenerate)

/*
 * Exports
 */

module.exports = router
