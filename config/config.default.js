'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1525493952176_3439';

  // add your config here
  config.middleware = [];

  // node中操控mongodb数据库的一个模块；可以连接数据库
  // 以对象的形式操作数据库
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/alexshan',
      options: {}
    }
  };

  // csrf（跨站访问安全设置）
  config.security = {
    csrf: false
  };

  return config;
};
