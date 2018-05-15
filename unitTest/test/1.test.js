const { assert } = require('chai');

// 异步测试
//  mocha -t 5000

describe('async', () => {
  it('async add', (done) => {
    setTimeout(() => {
      assert.equal(1 + 2, 3);
      done();
    }, 2000);
  });

  it('promise add', () => {
    return new Promise(function (resolve, rejcet) {
      setTimeout(() => {
        assert.equal(1 + 2, 3);
        resolve();
      }, 2000);
    })
  });

  
  it('async add', async () => {
    await new Promise(function (resolve, rejcet) {
      setTimeout(() => {
        assert.equal(1 + 2, 3);
        resolve();
      }, 2000);
    })
  });
});