'use strict';

module.exports = appInfo => {
  const config = exports = {
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1525493952176_3439';

  // add your config here
  config.middleware = ['errorHandler']; // 加载 errorHandler 中间件
  
  // 只对 /api 前缀的 url 路径生效
  config.errorHandler = {
    match: '/api',
  };

  // node中操控mongodb数据库的一个模块；可以连接数据库
  // 以对象的形式操作数据库
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/alexshan'
    }
  };

  // csrf（跨站访问安全设置）
  config.security = {
    csrf: false,
    domainWhiteList: ['http://localhost:3000']
  };

  // 允许跨域携带cookie
  config.cors = {
    credentials: true
  }

  return config;
};
