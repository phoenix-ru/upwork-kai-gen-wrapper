const { spawn } = require('child_process')
const CWD = '../nuxt-app/'

module.exports = class NPMInterface {
  constructor() {
    // todo
  }

  runGenerate() {
    return new Promise((resolve, reject) => {
      let proc

      try {
        proc = spawn('npm', ['run', 'generate'], {
          cwd: CWD,
          shell: true,
          stdio: 'inherit'
        })
      } catch (e) {
        this.logError(e)
        reject(e)
      }

      proc.on('error', (e) => {
        this.logError(e)
        reject(e)
      })

      proc.on('close', (code) => {
        console.log(`Child process exited with code ${code}`)

        if (code === 0) {
          resolve()
        } else {
          this.logError(new Error('Non-zero exit code'))
          reject(code)
        }
      })
    })
  }

  logError(error) {
    console.error(error)
  }
}
