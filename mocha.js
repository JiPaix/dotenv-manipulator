/* eslint-env mocha */
const assert = require('assert')
const dotenvM = require('./index')
const data = {
  'first': 'one',
  'second': 'two',
  'third': 'three',
  'fourth': 'four'
}

const toRemove = ['fourth', 'second']
const toUpdate = {
  'first': 1,
  'third': 3,
  'fifth': 5
}
describe('dotenv-manipulator', function () {
  describe('Methods', function () {
    beforeEach(function (done) {
      setTimeout(() => {
        done()
      }, 100)
    })
    it('should adds a bunch of keys and values', () => {
      dotenvM.bulkAdd(data, (e) => {
        assert.strictEqual(52, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should remove some of the previously added keys', () => {
      dotenvM.bulkDel(toRemove, (e) => {
        assert.strictEqual(27, dotenvM.fs.statSync('./.env').size)
      })
    })
    it('should updates values', () => {
      dotenvM.bulkUpdate(toUpdate, (e) => {
        assert.strictEqual(36, dotenvM.fs.statSync('./.env').size)
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
  })
})
