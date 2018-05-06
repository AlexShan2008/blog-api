const BaseController = require('./base');
class UsersController extends BaseController {
  // 注册
  async signup() {
    let { ctx } = this;
    //1.得到请求体 {username,password,email}
    let user = ctx.request.body;
    console.log(user)
    
    try {
      //保存数据库{_id,username,password,email}
      user = await ctx.model.User.create(user);
      this.success({ user });
    } catch (error) {
      this.error(error);
    }
  }
  // 登录
  async signin() {
    let { ctx } = this;
    let user = ctx.request.body;//得到请求体对象
    try {
      user = await ctx.model.User.findOne(user);
      if (user) {
        //如果登录成功了，则需要写入session会话
        //可以通过ctx.session.user是否为null来判断此用户是否登录
        ctx.session.user = user;
        this.success({ user });
      } else {
        this.error('用户名或密码错误!');
      }
    } catch (error) {
      this.error(error);
    }
  }

  async signout() {
    let { ctx } = this;
    ctx.session.user = null;
    this.success('退出成功');
  }
}
module.exports = UsersController;