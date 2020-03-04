import WebpackDevServer from 'webpack-dev-server'

const devServerConfig: WebpackDevServer.Configuration = {
  historyApiFallback: {
    rewrites: [
      { from: /.*/, to: '/index.html' },
    ],
  },
  host: '0.0.0.0',
  port: 8000,
  overlay: {
    errors: true
  },
  hot: true,
  useLocalIp: true,
  open: true,
  https: true,
  contentBase: false,
}

module.exports = devServerConfig
