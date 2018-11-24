const { resolve } = require('path');
const cluster = require('cluster');
const process = require('process');

const defaultOptions = {
  filePath: 'dist/server.js'
};

class AutoReloadWebpackPlugin {
  constructor({ filePath } = defaultOptions) {
    this.filePath = filePath;
    this.currentWorker = null;
  }

  apply(compiler) {
    cluster.setupMaster({
      exec: resolve(process.cwd(), this.filePath)
    });

    cluster.on('online', (worker) => {
      this.currentWorker = worker;
    });

    cluster.on('exit', () => {
      cluster.fork();
    });

    compiler.hooks.afterEmit.tap('AutoReloadWebpackPlugin', () => {
      if (this.currentWorker) {
        try {
          process.kill(this.currentWorker.process.pid, 'SIGTERM');
        } catch (e) {
          console.warn('Could not terminate this process');
        }
      }

      if (!this.currentWorker) {
        cluster.fork();
      }
    });
  }
}

module.exports = AutoReloadWebpackPlugin;
