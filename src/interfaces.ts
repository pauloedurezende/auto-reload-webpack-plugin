import { Worker } from 'cluster';

export interface IConstructor {
  file: string;
}

export interface IWebpack {
  hooks: {
    afterEmit: {
      tap(name: string, callback: () => void): void;
    };
  };
}

export interface IPlugin extends IConstructor {
  worker?: Worker;
  apply: (compiler: IWebpack) => void;
}
