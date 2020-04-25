const router = require('express').Router()
const { handlePing } = require('../controllers/main.controller')

/*
 * Router configuration
 */

router.get('/', handlePing)
router.get('/ping', handlePing)

/*
 * Exports
 */

module.exports = router
