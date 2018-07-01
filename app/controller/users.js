'use strict';
const BaseController = require('./base');

class UsersController extends BaseController {

  // 注册
  async signup() {
    const ctx = this.ctx;
    const user = ctx.request.body;
    try {
      // 保存数据库{_id,username,password,email}
      const res = await ctx.service.users.create(user); // TODO: 不能返回密码
      this.success({ user: res });
    } catch (error) {
      this.error(error);
    }
  }
  // 登录
  async signin() {
    const { ctx } = this;
    const user = ctx.request.body;// 得到请求体对象
    try {
      const doc = await ctx.model.User.findOne(user);
      if (doc) {
        // 如果登录成功了，则需要写入session会话
        // 可以通过ctx.session.user是否为null来判断此用户是否登录
        ctx.session.user = doc;
        this.success({ user: doc });
      } else {
        this.error('用户名或密码错误!');
      }
    } catch (error) {
      this.error(error);
    }
  }

  async signout() {
    const { ctx } = this;
    ctx.session.user = null;
    this.success('退出成功');
  }
}
module.exports = UsersController;
