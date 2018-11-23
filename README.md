# auto-reload-webpack-plugin

[![Travis Status][travis-badge]][travis-url]
[![Coveralls Status][coveralls-badge]][coveralls-url]
[![NPM Version][npm-badge]][npm-url]
[![License][license-badge]][license-url]

> A webpack plugin that restart automatically your application after compilation

## Installation

Install package

```bash
$ npm install --save-dev auto-reload-webpack-plugin
```

## Usage

```js
const AutoReloadWebpackPlugin = require('auto-reload-webpack-plugin');

plugins: [
  new AutoReloadWebpackPlugin({
    file: 'dist/server.js'
  })
];
```

## Development

- Cloning the repo

```bash
$ git clone https://github.com/pauloedurezende/auto-reload-webpack-plugin.git
```

- Installing dependencies

```bash
$ npm install
```

- Running scripts

| Action                                   | Usage               |
| ---------------------------------------- | ------------------- |
| Starting development mode                | `npm start`         |
| Linting code                             | `npm run lint`      |
| Running unit tests                       | `npm run jest`      |
| Running code coverage                    | `npm run coverage`  |
| Running lint + tests                     | `npm test`          |
| Sending coverage results to Coveralls.io | `npm run coveralls` |

## Author

[Paulo Rezende](https://twitter.com/pauloedurezende)

## License

[MIT](https://github.com/pauloedurezende/auto-reload-webpack-plugin/blob/master/LICENSE)

[travis-badge]: https://travis-ci.org/pauloedurezende/auto-reload-webpack-plugin.svg?branch=master
[travis-url]: https://travis-ci.org/pauloedurezende/auto-reload-webpack-plugin
[coveralls-badge]: https://coveralls.io/repos/github/pauloedurezende/auto-reload-webpack-plugin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/pauloedurezende/auto-reload-webpack-plugin?branch=master
[npm-badge]: https://img.shields.io/npm/v/auto-reload-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/auto-reload-webpack-plugin
[license-badge]: https://img.shields.io/github/license/pauloedurezende/auto-reload-webpack-plugin.svg
[license-url]: https://opensource.org/licenses/MIT
