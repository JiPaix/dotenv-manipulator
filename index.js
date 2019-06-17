'use strict'

class Env {
  constructor () {
    this.fs = require('fs')
    require('dotenv-expand')(require('dotenv').config())
  }

  _findKeyInString (string, key) {
    let regex = new RegExp(`(\r\n)*^${key}=.*(\r\n)*`, 'gim')
    if (string) {
      return string.match(regex)
    }
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

  bulkRemove (arr, done) {
    this._readEnv(envFile => {
      let err = []
      for (var key of arr) {
        key = key.toUpperCase()
        if (this._envHas(key)) {
          envFile = this._removeFromString(envFile, key)
          delete process.env[key]
        } else {
          err.push(key)
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
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      })
    })
  }

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

  remove (key, done) {
    this.bulkRemove([key], (err) => {
      if (typeof err !== 'undefined') {
        if (err.length > 1) {
          done(err)
        } else {
          done()
        }
      }
    })
  }

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
