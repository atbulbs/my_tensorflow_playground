import { Plugin, Compiler } from 'webpack'
const { exec } = require('child_process')
const chalk = require('chalk')
const info = msg => console.log(chalk.green(msg))
const warn = msg => console.log(chalk.red(msg))

class CMDPlugin implements Plugin {

  cmd: string

  public constructor (options) {
    this.cmd = options.cmd
  }

  apply (compiler: Compiler): void {
    // https://webpack.js.org/api/compiler-hooks/#emit
    compiler.hooks.afterEmit.tap('CMDPlugin', compilation => {
      info('start executing cmd!')
      exec(this.cmd, (err, stdout, stderr) => {
        if(err) {
          warn('deploy failed!')
          throw err
        } else {
          info(stdout)
          info('deploy succeed!')
          info('you can visit : ')
          info('https://atbulbs.github.io/my_tensorflow_playground_output/#/')
        }
      })
    })
  }

}

export {}

module.exports = CMDPlugin
