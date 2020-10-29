/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');

const common = require('./webpack/webpack.common');
const development = require('./webpack/webpack.dev');
const production = require('./webpack/webpack.prod');

module.exports = (env) => {
  switch (env.mode) {
    case 'development':
      return merge(common, development);

    case 'production':
      return merge(common, production);

    default:
      throw new Error(
        'No matching webpack configuration was found. Use `--env mode="development" || "production"` to specify an environment'
      );
  }
};
