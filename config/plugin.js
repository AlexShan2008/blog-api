'use strict';

// had enabled by egg
// exports.static = true;
// 将mongoose挂载到app上
exports.mongoose = {
  enabled: true,
  package: 'egg-mongoose'
};

// 跨域访问
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

// 验证请求参数
exports.validate = {
  enable: true,
  package: 'egg-validate',
};