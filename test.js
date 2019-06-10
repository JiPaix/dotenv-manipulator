var assert = require('assert')
let dotenvM = require('./index')

describe('dotenv-manipulator', () => {
    beforeEach((done) => {
        setTimeout(() => {
            done();
        }, 10);
    })
    it('should load', () => {
        assert.ok(dotenvM.constructor.name === "Env");
    })
    it('should have fs', () => {
        assert.equal('object', typeof dotenvM.fs)
    })

    describe('#add()', () => {
        it('should add a key with a value', () => {
            dotenvM.add('MOCHA', 'arbitrary value', err => {
                if (err) assert.fail(err)
                assert.equal(dotenvM.fs.statSync('./.env').size, 23)
            })
        })
    })
    describe('#update()', () => {
        it('should update the value of a previously added key', () => {
            assert.equal(dotenvM.fs.statSync('./.env').size, 23)
            dotenvM.update('MOCHA', 'second arbitrary value that is super long', err => {
                if (err) assert.fail(err)
                assert.equal(51, dotenvM.fs.statSync('./.env').size)
            })
        })
    })

    describe('#del()', () => {
        it('should remove a key and leave the filesize at 0', () => {
            assert.equal(51, dotenvM.fs.statSync('./.env').size)
            dotenvM.del('MOCHA', err => {
                if (err) assert.fail(err)
                assert.equal(0, dotenvM.fs.statSync('./.env').size)
            })
        })
    })
})
