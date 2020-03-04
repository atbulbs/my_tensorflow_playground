import { Plugin } from 'webpack'
const CMDPlugin = require('../cmd_plugin')

const pluginsConfig: Plugin[] = [
  new CMDPlugin({
    // https://www.cnblogs.com/caicaizi/p/9643902.html
    // https://www.cnblogs.com/chenduzizhong/p/9009927.html
    cmd: 'cd output && git add . && git commit -m "stage" && git push  && cd ..'
  })
]

module.exports = pluginsConfig
