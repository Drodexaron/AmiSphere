const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/js/login.js',
  output: {
    path: path.resolve(__dirname, './public/js'),  
    filename: 'bundle.js',
  },
};
