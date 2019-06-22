'use strict'
/**
 * @example
 * const dotenvM = require('dotenv-manipulator')
 */
class Env {
  /**
   * Loads dependencies and create a .env file if there's none
   *
   * @hideconstructor
   * @example
   * const dotenvM = require('dotenv-manipulator')
   */

  /**
* @callback Env~done
* @param  {Array} [array] - Value of array element
* @returns {Array.<string>|Void}
*/
  constructor () {
    this.fs = require('fs')
    require('dotenv-expand')(require('dotenv').config())
    this.fs.writeFile('./.env', '', { flag: 'wx' }, (e) => {
      return e
    })
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
    return string.replace(regex, ObjAsString)
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
  * Takes an object and adds its keys and values to the environment, ignore keys already in it.
  * @param {Object.<string, string>} obj - Object containing keys and values.
  * @param {Env~done} callback - callback listing ignored keys.
  * @example
  * let obj = {'first' : 'one','second' : 'two'}
  *
  * dotenvM.bulkAdd(obj, (ignored) => {
  *   if(ignored)
  *     // array of ignored keys
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
          err.push(KEY)
        }
      })
      this._writeEnv(newEnvFile, () => {
        if (err.length > 0) {
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
  * @param {Env~done} callback - callback listing ignored keys.
  * @example
  * let arr = ['first', 'second', 'third', 'fourth']
  *
  * dotenvM.bulkDel(arr, (ignored) => {
  *   if(ignored)
  *     // array of ignored keys
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
        if (err.length > 0) {
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
   * @param {Env~done} done - Callback listing ignored keys.
   * @example
   * let obj = {'first' : 'one','second' : 'two'}
   *
   * dotenvM.bulkUpdate(obj, (added) => {
   *   if(added)
   *    // array of added keys (instead of updated)
   * })
   */
  bulkUpdate (obj, done) {
    this._readEnv(envFile => {
      let err = []
      let newEnvFile = envFile
      Object.keys(obj).map(key => {
        let KEY = key.toUpperCase()
        if (!this._envHas(KEY) && !this._findKeyInString(KEY, newEnvFile)) {
          newEnvFile = this._addToString(newEnvFile, KEY, obj[key])
          process.env[KEY] = obj[key]
          err.push(KEY)
        } else {
          process.env[KEY] = obj[key]
          newEnvFile = this._updateToString(newEnvFile, KEY, obj[key])
        }
      })
      this._writeEnv(newEnvFile, () => {
        if (err.length > 0) {
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
  * @param {Env~done} done - callback listing ignored keys.
  * @example
  * dotenvM.add('public_ip', '255.255.255.0', (ignored) => {
  *   if(ignored) // array with the ignored key
  * })
  */
  add (key, value, done) {
    this.bulkAdd(this._parse(key, value), (err) => {
      if (typeof err !== 'undefined') {
        done(err)
      } else {
        done()
      }
    })
  }

  /**
  * @description Removes an existing key from the environment.
  * @param {string} key - A key.
  * @param {string} value - a value.
  * @param {Env~done} done - callback listing ignored keys.
  * @example
  * dotenvM.del('public_ip', () => {
  *   if(ignored) // array with the ignored key
  * })
  */
  del (key, done) {
    this.bulkDel([key], (err) => {
      if (typeof err !== 'undefined') {
        done(err)
      } else {
        done()
      }
    })
  }

  /**
  * @description Updates an existing key from the environment. Adds it if non-existant.
  * @param {string} key - a key.
  * @param {string} value - a value.
  * @param {Env~done} done - callback listing ignored keys.
  *@example
  * dotenvM.update('public_ip', '255.255.255.0', (added) => {
  *   if(added) // array with the key if it's added instead of updated
  * })
  */
  update (key, value, done) {
    this.bulkUpdate(this._parse(key, value), (err) => {
      if (typeof err !== 'undefined') {
        done(err)
      } else {
        done()
      }
    })
  }
}

const instance = new Env()
module.exports = Object.freeze(instance)
