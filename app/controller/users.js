const BaseController = require('./base');

// 定义创建接口的请求参数规则
const signupRule = {
  accesstoken: 'string',
  title: 'string',
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  content: 'string',
};

class UsersController extends BaseController {

  // 注册
  async signup() {
    let ctx = this.ctx;
    //1.得到请求体 {username,password,email}

    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    // ctx.validate(signupRule);
    // const id = await ctx.service.topics.create(ctx.request.body);
    // // 设置响应体和状态码
    // ctx.body = {
    //   topic_id: id,
    // };
    // ctx.status = 201;

    let user = ctx.request.body;
    console.log(user)
    
    try {
      //保存数据库{_id,username,password,email}
      user = await ctx.model.User.create(user); //TODO: 不能返回密码
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