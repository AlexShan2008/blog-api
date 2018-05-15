'use strict';

const { Service } = require('egg');

class UserService extends Service {
  async create(user) {
    const doc = await this.ctx.model.User.findOne(user);
    if (doc) {
      this.error('用户名已存在!');
    } else {
      const res = await this.ctx.model.User.create(user);
      return res;
    }
  }
}

module.exports = UserService;

