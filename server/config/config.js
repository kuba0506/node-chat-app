const path = require('path');

const publicPath = path.join(__dirname, '../../public');
const node_modules = path.join(__dirname, '../../node_modules');
const port = process.env.PORT || 3000;

module.exports = { publicPath, node_modules, port };