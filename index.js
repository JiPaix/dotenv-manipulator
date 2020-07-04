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
  * Adds keys and values from object
  * @param {Object.<string, string>} obj - Object containing keys and values.
  * @param {Env~done=} done - callback.
  * @example
  * let obj = {'first' : 'one','second' : 'two'}
  *
  * dotenvM.bulkAdd(obj, (failed) => {
  *   if(failed) // if one or more keys already exists they'll remain untouched
  *       console.log(failed) //=> ['SECOND']
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
        if(done) {
          if (err.length > 0) {
            done(err)
          } else {
            done()
          }
        }
      })
    })
  }

  /**
  * Deletes multiple keys (and their values).
  * @param {string[]} arr - Array containing keys.
  * @param {Env~done=} done - callback.
  * @example
  * let arr = ['first', 'second', 'third', 'fourth']
  *
  * dotenvM.bulkDel(arr, (ignored) => {
  *   if(ignored) // if one or more keys were already non-existent
  *       console.log(ignored) //=> ['second', 'third', 'fourth']
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
        if(done) {
          if (err.length > 0) {
            done(err)
          } else {
            done()
          }
        }
      })
    })
  }

  /**
   * @description Updates values from a given object.
   * @param {string[]} obj - Object containing keys and values to update.
   * @param {Env~done=} done - callback.
   * @example
   * let obj = {'first' : 'one', 'second' : 'two', 'third' : 'three'}
   *
   * dotenvM.bulkUpdate(obj, (added) => {
   *   if(added) // if one or more keys were added instead of updated
   *       console.log(added) //=> ['second', 'third']
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
        if(done) {
          if (err.length > 0) {
            done(err)
          } else {
            done()
          }
        }
      })
    })
  }

  /**
  * @description Adds a key/value.
  * @param {string} key - key to add.
  * @param {string} value - value.
  * @param {Env~done=} done - callback.
  * @example
  * dotenvM.add('public_ip', '255.255.255.0', (failed) => {
  *   if(failed) // if 'public_ip' is already defined in the env it'll remain untouched.
  *     console.log(failed) //=> ['PUBLIC_IP']
  * })
  */
  add (key, value, done) {
    this.bulkAdd(this._parse(key, value), (err) => {
      if(done) {
        if (typeof err !== 'undefined') {
          done(err)
        } else {
          done()
        }
      }
    })
  }

  /**
  * @description Deletes a key (and its value)
  * @param {string} key - key to delete.
  * @param {Env~done=} done - callback.
  * @example
  * dotenvM.del('public_ip', () => {
  *   if(ignored) // if 'public_ip' was already non-existent
  *       console.log(ignored) //=> ['PUBLIC_IP']
  * })
  */
  del (key, done) {
    this.bulkDel([key], (err) => {
      if(done) {
        if (typeof err !== 'undefined') {
          done(err)
        } else {
          done()
        }
      }
    })
  }

  /**
  * @description Updates a key.
  * @param {string} key - key to update.
  * @param {string} value - new value.
  * @param {Env~done=} done - callback.
  *@example
  * dotenvM.update('public_ip', '255.255.255.0', (added) => {
  *   if(added) // if 'public_ip' was added instead of updated
  *       console.log(added) //=> ['PUBLIC_IP']
  * })
  */
  update (key, value, done) {
    this.bulkUpdate(this._parse(key, value), (err) => {
      if(done) {
        if (typeof err !== 'undefined') {
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
