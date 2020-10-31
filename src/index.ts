import cluster, { Worker } from 'cluster';

import { IPlugin, IConstructor, IWebpack } from './interfaces';

class AutoReloadPlugin implements IPlugin {
  file: string;
  worker?: Worker;

  constructor({ file }: IConstructor) {
    this.file = file;
    this.worker = undefined;
  }

  apply({ hooks }: IWebpack): void {
    cluster.setupMaster({ exec: this.file });

    cluster.on('online', (worker) => (this.worker = worker));
    cluster.on('exit', () => cluster.fork());

    hooks.afterEmit.tap('AutoReloadWebpackPlugin', () => {
      if (this.worker) {
        try {
          process.kill(this.worker.process.pid, 'SIGTERM');
        } catch (err) {
          console.error(
            `The process could not be terminated - PID #${this.worker.process.pid}`,
            err
          );
        }
      }

      if (!this.worker) {
        cluster.fork();
      }
    });
  }
}

export default AutoReloadPlugin;
