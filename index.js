'use strict';
module.exports = function() {
  throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
};

module.exports.Resizable = require('./build/resizable').default;
module.exports.ResizableBox = require('./build/resizableBox').default;
