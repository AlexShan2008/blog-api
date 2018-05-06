'use strict';

// had enabled by egg
// exports.static = true;
// 将mongoose挂载到app上
exports.mongoose = {
  enabled: true,
  package: 'egg-mongoose'
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};