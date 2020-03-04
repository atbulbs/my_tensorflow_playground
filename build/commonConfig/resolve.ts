import { Resolve } from 'webpack'
const resolve: Function = require('../utils/resolve')

const resolveConfig: Resolve = {
  extensions: ['.js', '.ts', '.jsx', '.json'],
  alias: {
    'styles': resolve('src/assets/styles'),
  }
}

module.exports = resolveConfig
