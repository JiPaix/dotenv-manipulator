/* eslint-env mocha */
const assert = require('assert')
const dotenvM = require('../index.js')
process.env.SEVENTH = 'seven'
const data = {
  'first': 'one',
  'second': 'two',
  'third': 'three',
  'fourth': 'four',
  'seventh': 'seven'
}

const toRemove = ['fourth', 'second', 'eighth']
const toUpdate = {
  'first': 1,
  'third': 3,
  'fifth': 5
}
describe('dotenv-manipulator', function () {
  describe('Pass #1', function () {
    beforeEach(function (done) {
      setTimeout(() => {
        done()
      }, 300)
    })
    it('should adds a bunch of keys and values', () => {
      dotenvM.bulkAdd(data, (e) => {
        assert.strictEqual(49, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should remove some of the previously added keys', () => {
      dotenvM.bulkDel(toRemove, (e) => {
        assert.strictEqual(24, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should updates values', () => {
      dotenvM.bulkUpdate(toUpdate, (e) => {
        assert.strictEqual(27, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should add 1 key/value pair', () => {
      dotenvM.add('sixth', 'six', (e) => {
        assert.strictEqual(38, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should remove 1 key/value pair', () => {
      dotenvM.del('fifth', (e) => {
        assert.strictEqual(29, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should update 1 key/value pair', () => {
      dotenvM.update('sixth', 6, (e) => {
        assert.strictEqual(27, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('process.env should have changed according to previous manipulations', () => {
      let arr = []
      arr.push(process.env.FIRST === '1')
      arr.push(process.env.SECOND === undefined)
      arr.push(process.env.THIRD === '3')
      arr.push(process.env.FOURTH === undefined)
      arr.push(process.env.FIFTH === undefined)
      arr.push(process.env.SIXTH === '6')
      assert.ok(!arr.includes('false'))
    })
    after(function () {
      dotenvM.bulkDel(['first', 'third', 'sixth'], () => {

      })
    })
  })

  describe('Pass #2', function () {

    beforeEach(function (done) {
      setTimeout(() => {
        done()
      }, 300)
    })

    it('add a value using update()', function () {
      dotenvM.update('first', 'un', () => {
        assert.strictEqual(10, dotenvM.fs.statSync('./.env').size)
      })
    })

    it('not add a value because its already set', function () {
      dotenvM.add('first', 'un', () => {
        assert.strictEqual(10, dotenvM.fs.statSync('./.env').size)
      })
    })
  })
})
