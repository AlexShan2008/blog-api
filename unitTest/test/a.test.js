const { assert } = require('chai');
const { add, minus, multipy, devide} = require('./calulator');

describe('test calulator', () => {
  it('add', () => {
    assert.equal(add(1, 1), 2)
  });

  it('minus', () => {
    assert.equal(minus(1, 1), 0)
  });

  it('multipy', () => {
    assert.equal(multipy(1, 1), 1)
  });

  it('devide', () => {
    assert.equal(devide(1, 1), 1)
  });
});