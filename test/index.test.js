const cluster = require('cluster');
const { resolve } = require('path');
const Plugin = require('../src');

describe('AutoReloadWebpackPlugin', () => {
  beforeEach(() => {
    this.plugin = new Plugin({ filePath: 'test/mocks/server.js' });
  });

  describe('constructor', () => {
    test('should receive a default `filePath`', () => {
      const optionDefault = new Plugin();
      expect(optionDefault.filePath).toEqual('dist/server.js');
    });

    test('should receive a custom `filePath`', () => {
      expect(this.plugin.filePath).toEqual('test/mocks/server.js');
    });

    test('should not have a `currentWorker` defined', () => {
      expect(this.plugin.currentWorker).toEqual(null);
    });
  });

  describe('apply', () => {
    beforeEach(() => {
      this.setupMaster = jest.spyOn(cluster, 'setupMaster');
      this.on = jest.spyOn(cluster, 'on');

      this.worker = { process: { pid: 1234 } };
      this.compiler = {
        hooks: {
          afterEmit: {
            tap: jest.fn()
          }
        }
      };
      this.plugin.apply(this.compiler);
    });

    afterEach(() => {
      this.setupMaster.mockRestore();
      this.on.mockRestore();
    });

    test('should setup a master process', () => {
      const path = resolve(process.cwd(), this.plugin.filePath);

      expect(this.setupMaster).toHaveBeenCalledWith({
        exec: path
      });
    });

    test('should listen to the cluster', () => {
      expect(this.on).toHaveBeenCalled();
    });

    test('should listen to `online` events', () => {
      expect(this.on.mock.calls[0][0]).toEqual('online');
    });

    test('should set the `currentWorker`', () => {
      cluster.emit('online', this.worker);

      expect(this.plugin.currentWorker).toEqual(this.worker);
    });

    test('should add `afterEmit` hook', () => {
      expect(this.compiler.hooks.afterEmit.tap).toHaveBeenCalled();
    });

    describe('when `afterEmit` is triggered', () => {
      describe('if `currentWorker` exists', () => {
        beforeEach(() => {
          this.kill = jest.spyOn(process, 'kill');
          this.fork = jest.spyOn(cluster, 'fork').mockImplementation(() => {});

          this.plugin.currentWorker = { process: { pid: 1234 } };
          this.compiler = {
            hooks: {
              afterEmit: {
                tap: (event, callback) => {
                  expect(event).toEqual('AutoReloadWebpackPlugin');

                  callback();
                }
              }
            }
          };
          this.plugin.apply(this.compiler);
        });

        afterEach(() => {
          this.kill.mockRestore();
          this.fork.mockRestore();
        });

        test('should terminate the process', () => {
          expect(this.kill).toHaveBeenCalledWith(1234, 'SIGTERM');
        });

        test('should listen to `exit` events', () => {
          cluster.emit('exit', () => {
            expect(this.on.mock.calls[0][0]).toEqual('exit');
          });
        });

        test('should fork a new worker', () => {
          cluster.emit('exit', () => {
            expect(this.fork).toHaveBeenCalled();
          });
        });
      });

      describe('if `currentWorker` not exists', () => {
        beforeEach(() => {
          this.fork = jest.spyOn(cluster, 'fork').mockImplementation(() => {});

          this.compiler = {
            hooks: {
              afterEmit: {
                tap: (event, callback) => {
                  expect(event).toEqual('AutoReloadWebpackPlugin');

                  callback();
                }
              }
            }
          };
          this.plugin.apply(this.compiler);
        });

        afterEach(() => {
          this.fork.mockRestore();
        });

        test('should create a new worker', () => {
          expect(this.fork).toHaveBeenCalled();
        });
      });
    });
  });
});
