'use strict';

const supertest = require('supertest');
const app = require('./server');
const { assert } = require('chai');

// 分组
describe('test api', function () {
  // 一个测试用例
  it('test /', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect('Content-Length', '2')
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.text, 'ok');
        done();
      });
  });

  it('test /', function (done) {
    request(app)
      .get('/post')
      .send({ name: 'shan' }) // 发送请求体
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.text, 'ok');
        assert.equal(response.body, { name: 'shan' });
        done();
      });
  });
});


// super test
