'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('user service', function () {
  if ('sign up', async function () {
    let ctx = app.mockContext();
    let doc = await ctx.service.user.create({ username: 'shan', password: '999' })
    assert(doc);
    assert(doc_id);
    assert.equal(doc)
  })
})