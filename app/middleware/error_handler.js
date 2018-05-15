'use strict';
/**
 * 统一错误处理
 * Controller 中 this.ctx.validate() 进行参数校验，失败抛出异常。
 * Service 中调用 this.ctx.curl() 方法访问 CNode 服务，可能由于网络问题等原因抛出服务端异常。
 * Service 中拿到 CNode 服务端返回的结果后，可能会收到请求调用失败的返回结果，此时也会抛出异常。
 */

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
