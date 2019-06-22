'use strict'
/**
 * @example
 * const dotenvM = require('dotenv-manipulator')
 */
class Env {
  /**
   * Loads dependencies : fs, dotenv, dotenv-expand.
   *
   * @hideconstructor
   * @example
   * const dotenvM = require('dotenv-manipulator')
   */

  constructor () {
    this.fs = require('fs')
    require('dotenv-expand')(require('dotenv').config())
  }

  _findKeyInString (string, key) {
    let regex = new RegExp(`(\r\n)*^${key}=.*(\r\n)*`, 'gim')
    return string.match(regex)
  }

  _removeFromString (env, key) {
    let regex = new RegExp(`^(\r\n)*^${key}=.*(\r\n)*`, 'gim')
    return env.replace(regex, '')
  }

  _envHas (KEY) {
    return process.env.hasOwnProperty(KEY)
  }

  _addToString (string, key, value) {
    let regex = new RegExp(`^(\r\n)`, 'gim')
    let ObjAsString = `${key}=${value}\r\n`
    if (string) {
      return string.replace(regex, '') + ObjAsString
    } else {
      return ObjAsString
    }
  }

  _parse (key, value) {
    let obj = {}
    obj[key] = value
    return obj
  }

  _updateToString (string, key, value) {
    let regex = new RegExp(`^${key}=.*`, 'gim')
    let ObjAsString = `${key}=${value}`
    if (string) {
      return string.replace(regex, ObjAsString)
    } else {
      return ObjAsString
    }
  }

  _readEnv (done) {
    let fileContent
    this.fs.createReadStream('./.env').on('data', data => {
      fileContent = data.toString()
    }).on('end', () => {
      done(fileContent || Buffer.alloc(0).toString())
    })
  }

  _writeEnv (newContent, done) {
    let stream = this.fs.createWriteStream('./.env', { flags: 'w+', encoding: 'utf8' })
      .once('open', () => {
        stream.write(newContent, () => {
          done()
        })
      })
  }
  /**
 * Callback.
 *
 * @description Callback.
 * @callback Env~done
 * @param {string[]} [err] - Array of ignored keys.
 */

  /**
  * Takes an object and adds its keys and values to the environment, ignore keys already in it.
  * @param {Object.<string, string>} obj - Object containing keys and values.
  * @param {Env~done} [callback] - callback listing ignored keys.
  * @example
  * const dotenvM = require('dotenv-manipulator')
  *
  * let myObj = {
  *   'first' : 'one',
  *   'second' : 'two',
  *   'third' : 'three',
  *   'fourth' : 'four'
  * }
  *
  * dotenvM.bulkAdd(myObj)
  * @example <caption> OR </caption>
  * const dotenvM = require('dotenv-manipulator')
  *
  * dotenvM.add(myObj, (err) => {
  *   if(err) // could returns : ['SECOND', 'FOURTH'] if the keys were already set
  *     // else ....
  * })
  */

  bulkAdd (obj, done) {
    this._readEnv(envFile => {
      let newEnvFile = envFile
      let err = []
      Object.keys(obj).map(key => {
        let KEY = key.toUpperCase()

        if (!this._envHas(KEY) && !this._findKeyInString(KEY, newEnvFile)) {
          newEnvFile = this._addToString(newEnvFile, KEY, obj[key])
          process.env[KEY] = obj[key]
        } else {
          err.push(key)
        }
      })
      this._writeEnv(newEnvFile, () => {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      })
    })
  }

  /**
  * Takes an array of keys and remove them (and their values) from the environment, ignore already non-existing keys.
  * @param {string[]} arr - Array containing keys.
  * @param {Env~done} [callback] - callback listing ignored keys.
  * @example
  * const dotenvM = require('dotenv-manipulator')
  *
  * let myArr = ['first', 'second', 'third', 'fourth']
  *
  * dotenvM.bulkDel(myArr)
  * @example <caption> OR </caption>
  * const dotenvM = require('dotenv-manipulator')
  *
  * dotenvM.bulkDel(myArr, (err) => {
  *   if(err) // could returns : ['SECOND', 'FOURTH'] if the keys were already non-existant
  *     // else ....
  * })
  */

  bulkDel (arr, done) {
    this._readEnv(envFile => {
      let err = []
      for (let key of arr) {
        let KEY = key.toUpperCase()
        if (this._envHas(KEY)) {
          envFile = this._removeFromString(envFile, KEY)
          delete process.env[KEY]
        } else {
          err.push(KEY)
        }
      }
      this._writeEnv(envFile, () => {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      })
    })
  }

  /**
   * @description Takes an object and update values of existing keys, adds them if they aren't already in the environment.
   *
   * @param {string[]} obj - Array containing keys.
   * @param {Env~done} [done] - Callback listing ignored keys.
   * @example
   * const dotenvM = require('dotenv-manipulator')
   *
   * let myObj = {
   *  'first' : 'one',
   *  'second' : 'two',
   *  'third' : 'three',
   *  'fourth' : 'four'
   * }
   *
   * dotenvM.bulkUpdate(myObj)
   * @example <caption> OR </caption>
   * const dotenvM = require('dotenv-manipulator')
   *
   * dotenvM.bulkUpdate(myObj, (err) => {
   *   if(err) // could returns : ['SECOND', 'FOURTH'] if the keys were non-existant
   *     // else ....
   * })
   */
  bulkUpdate (obj, done) {
    this._readEnv(envFile => {
      let err = []
      let newEnvFile = envFile
      Object.keys(obj).map(key => {
        let KEY = key.toUpperCase()
        if (!this._envHas(KEY) || !this._findKeyInString(KEY, newEnvFile)) {
          newEnvFile = this._addToString(newEnvFile, KEY, obj[key])
          process.env[KEY] = obj[key]
          err.push(KEY)
        } else {
          process.env[KEY] = obj[key]
          newEnvFile = this._updateToString(newEnvFile, KEY, obj[key])
        }
      })
      this._writeEnv(newEnvFile, () => {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      })
    })
  }

  /**
  * @description Adds a key/value pair, only if the key isn't already set in the environment.
  * @param {string} key - A key.
  * @param {string} value - a value.
  * @param {Env~done} [done] - callback listing ignored keys.
  * @example
  * dotenvM.add('hostname', 'mywebsite.com')
  * @example
  * dotenvM.add('public_ip', '255.255.255.0', (err) => {
  *   if(err) // returns : ['PUBLIC_IP'] if the key was already set
  *     // else ....
  * })
  */
  add (key, value, done) {
    this.bulkAdd(this._parse(key, value), (err) => {
      if (typeof err !== 'undefined') {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      }
    })
  }

  /**
  * @description Removes an existing key from the environment.
  * @param {string} key - A key.
  * @param {string} value - a value.
  * @param {Env~done} [done] - callback listing ignored keys.
  * @example
  * dotenvM.del('hostname')
  * @example
  * dotenvM.del('public_ip', (err) => {
  *   if(err) // returns : ['PUBLIC_IP'] if the key was non-existant
  *     // else ....
  * })
  */
  del (key, done) {
    this.bulkDel([key], (err) => {
      if (typeof err !== 'undefined') {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      }
    })
  }

  /**
  * @description Updates an existing key from the environment. Adds it if non-existant.
  * @param {string} key - a key.
  * @param {string} value - a value.
  * @param {Env~done} [done] - callback listing ignored keys.
  *@example
  * dotenvM.update('hostname', 'mywebsite.com')
  * @example
  * dotenvM.update('public_ip', '255.255.255.0', (err) => {
  *   if(err) // returns : ['PUBLIC_IP'] if the key was non-existant
  *     // else ....
  * })
  */
  update (key, value, done) {
    this.bulkUpdate(this._parse(key, value), (err) => {
      if (typeof err !== 'undefined') {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      }
    })
  }
}

const instance = new Env()
module.exports = Object.freeze(instance)
