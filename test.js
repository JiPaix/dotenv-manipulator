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
            dotenvM._add('MOCHA', 'aribtrary value', () => {
                if (process.env.MOCHA === 'aribtrary value' && dotenvM.fs.statSync('./.env').size == 24) {
                    assert.ok(true)
                } else if (dotenvM.fs.statSync('./.env').size !== 24) {
                    assert.fail('something went wrong with the file')
                } else if (process.env.MOCHA === 'aribtrary value') {
                    assert.fail(`can't access process.env ADD`)
                }
            })
        })
        it('del()', () => {
            process.env.MOCHA = 'arbitrary value';
            dotenvM._del('MOCHA', () => {
                if (typeof process.env.MOCHA === 'undefined' && dotenvM.fs.statSync('./.env').size == 0) {
                    assert.ok(true)
                } else if (dotenvM.fs.statSync('./.env').size !== 0) {
                    assert.fail('something went wrong with the file')
                } else if (typeof process.env.MOCHA !== 'undefined') {
                    assert.fail(`can't access process.env ADD`)
                }
            })
        })
        it('update()', () => {
            dotenvM._add('MOCHA', 'aribtrary value', () => {
                dotenvM._del('MOCHA', () => {
                    dotenvM._add('MOCHA', 'second aribtrary value', () => {
                        if (process.env.MOCHA === 'second aribtrary value' && dotenvM.fs.statSync('./.env').size === 31) {
                            assert.ok(true)
                        } else if (dotenvM.fs.statSync('./.env').size !== 31) {
                            assert.fail('something went wrong with the file')
                        } else if (process.env.MOCHA === 'second aribtrary value') {
                            assert.fail(`can't access process.env ADD`)
                        }
                    })
                })
            })
        })
    })
})
