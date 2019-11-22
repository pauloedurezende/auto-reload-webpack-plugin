const { resolve } = require('path');
const { cwd } = require('process');

const getFileExecutionPath = (file) => {
  const executionPath = cwd();

  return resolve(executionPath, file);
};

module.exports = {
  getFileExecutionPath
};
