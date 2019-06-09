var assert = require('assert')
let dotenvM = require('./index')

describe('dotenvM', () => {
    it('loads itself', () => {
        assert.ok(dotenvM.constructor.name === "Env");
    })
    it('loads its dependencies', () => {
        assert.equal('object', typeof dotenvM.fs)
    })
    describe('Methods', () => {
        it('add()', () => {
            dotenvM.add('MOCHA', true)
            assert.ok(process.env.MOCHA)
        })
        it('del()', () => {
            process.env.MOCHA = true;
            dotenvM.del('MOCHA')
            setTimeout(() => {
                assert.equal('undefined', typeof process.env.MOCHA)
            }, 250)
        })
        it('update()', () => {
            dotenvM.add('MOCHA', false)
            dotenvM.update('MOCHA', true)
            assert.ok(process.env.MOCHA)
        })
    })
})
