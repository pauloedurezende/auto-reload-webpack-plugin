const cluster = require('cluster');
const { getFileExecutionPath } = require('./utils');

class AutoReloadWebpackPlugin {
  constructor({ file }) {
    this.file = getFileExecutionPath(file);
    this.worker = null;
  }

  apply({ hooks }) {
    cluster.setupMaster({
      exec: this.file
    });

    cluster.on('online', (worker) => (this.worker = worker));
    cluster.on('exit', () => cluster.fork());

    hooks.afterEmit.tap('AutoReloadWebpackPlugin', () => {
      if (this.worker) {
        try {
          process.kill(this.worker.process.pid, 'SIGTERM');
        } catch (error) {
          console.warn('Could not terminate this process');
        }
      }

      !this.worker && cluster.fork();
    });
  }
}

module.exports = AutoReloadWebpackPlugin;
