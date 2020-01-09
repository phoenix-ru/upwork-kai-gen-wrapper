const express = require('express')
const router = express.Router()
const Generator = require('../handlers/generate.handler')

function respondSuccess(res, data) {
  res.json({ code: 200, message: 'Success', data })
}

router.get('/', (req, res) => {
  respondSuccess(res, 'Application works, great!')
})

router.get('/generate', (req, res) => {
  // todo invoke handler and check credentials (using October CMS API)
  // todo call child process generate
  const generatorConfiguration = { foo: 'bar' }

  /* Create a generator with specified configuration */
  const generator = new Generator(generatorConfiguration)
  generator.generate()

  respondSuccess(res, { secret: 'TOKEN HERE' })
  // todo push token to temporary storage (even in-memory should do it)
  // todo after that, client must establish socket connection using secret he got and we will do other things through it

  generator.cleanup()
})

module.exports = router
