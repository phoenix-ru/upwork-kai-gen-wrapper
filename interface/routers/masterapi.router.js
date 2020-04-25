const router = require('express').Router()
const { handleGeneration } = require('../controllers/generation.controller')

/*
 * Routes specifically for Master Api to call
 */

router.post('/generate', handleGeneration)

/*
 * Exports
 */

module.exports = router
