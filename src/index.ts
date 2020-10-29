import cluster, { Worker } from 'cluster';

interface IWebpack {
  hooks: {
    afterEmit: {
      tap(identifier: string, callback: any): void;
    };
  };
}

interface IPlugin {
  file: string;
  worker?: Worker;
  apply(params: IWebpack): void;
}

class AutoReloadPlugin implements IPlugin {
  file: string;

  worker?: Worker;

  constructor({ file }: IPlugin) {
    this.file = file;
    this.worker = undefined;
  }

  apply({ hooks }: IWebpack): void {
    cluster.setupMaster({ exec: this.file });

    cluster.on('online', (worker) => {
      this.worker = worker;
    });
    cluster.on('exit', () => cluster.fork());

    hooks.afterEmit.tap('AutoReloadWebpackPlugin', () => {
      if (this.worker) {
        try {
          process.kill(this.worker.process.pid, 'SIGTERM');
        } catch (err) {
          console.warn(
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
