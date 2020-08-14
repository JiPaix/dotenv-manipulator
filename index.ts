import * as fs from 'fs'
import * as path from 'path'

/**
 * dotenv Manipulator :
 * - Load environment variables from a `.env` to `process.env`
 * - Add, update, or remove variables from both your `.env` file and `process.env` <b>at runtime</b>
 * @example
 * ```js
 * // require
 * const Manipulator = require('dotenv-manipulator').default
 * ```
 * @example
 * ```js
 * // import
 * import Manipulator from 'dotenv-manipulator'
 * ```
 */
class Manipulator {
  public env_path: string
  public env: { [x: string]: string }
  public encoding: 'ascii' | 'base64' | 'binary' | 'hex' | 'latin1' | 'ucs-2' | 'ucs2' | 'utf-8' | 'utf8' | 'utf16le' =
    'utf-8'
  public throwable: boolean
  /**
   * Starts dotenv Manipulator
   * @param envPath Path to `.env`, default is `__dirname`.
   * @param throwable If set to `true` functions throw errors whenever there's an incorrect input.
   * @param encoding Specify file encoding, default is `utf8`.
   * @example
   * ```js
   * // basic setup
   * const Manipulator = require('dotenv-manipulator')
   * const dotenvM = new Manipulator()
   * ```
   * @example
   * ```js
   * // complete setup
   * const Manipulator = require('dotenv-manipulator')
   * const dotenvM = new Manipulator('/path/to/project', false, 'utf-8')
   * ```
   * @example
   * ```js
   * // undefined = default value
   * const Manipulator = require('dotenv-manipulator')
   * const dotenvM = new Manipulator(undefined, true, 'latin1')
   * ```
   */
  constructor(
    envPath = path.normalize(__dirname),
    throwable = false,
    encoding:
      | 'ascii'
      | 'base64'
      | 'binary'
      | 'hex'
      | 'latin1'
      | 'ucs-2'
      | 'ucs2'
      | 'utf-8'
      | 'utf8'
      | 'utf16le' = 'utf-8'
  ) {
    this.encoding = encoding
    this.throwable = throwable
    this.env_path = path.join(envPath, '.env')
    if (!fs.existsSync(this.env_path)) {
      fs.closeSync(fs.openSync(this.env_path, 'w'))
    }
    this.env = this.__readSync()
    this.__sort()
  }

  private __readSync() {
    const OBJ: {
      [x: string]: string
    } = {}
    const file = fs.readFileSync(this.env_path, { encoding: this.encoding }).toString().split(/\r?\n/)
    if (file.length) {
      for (const line of file) {
        if (line !== '') {
          const keyvalue = line.split('=')
          if (keyvalue.length === 2) {
            OBJ[keyvalue[0]] = keyvalue[1]
            process.env[keyvalue[0]] = keyvalue[1]
          }
        }
      }
    }
    return OBJ
  }

  /**
   * Add object keys and values to `.env` file and `process.env`
   * @param obj Object to add to the environment
   * @param force If you try to add a key/value pair that is already in the environment :<br/>- `add(obj, true)` would update said variables <br/> - `add(obj)` would just ignore your input
   * @example
   * ```js
   * const obj = { REMOTE: '95.81.123.228', PORT: 3000 }
   * dotenvM.add(obj)
   * ```
   * @example
   * ```js
   * // without force argument
   * console.log(process.env.REMOTE_PORT) //=> '3000'
   * dotenvM.add({ REMOTE_PORT: '2000' })
   * console.log(process.env.REMOTE_PORT) //=> '3000'
   *
   * // with force argument set to true
   * dotenvM.add({ REMOTE_PORT: '2000' }, true)
   * console.log(process.env.REMOTE_PORT) //=> '2000'
   * ```
   * @example
   * ```js
   * // DEBUGGING #1
   * dotenvM.throwable = false
   *
   * let debug = dotenvM.add(['wrong', 'type', 'of', 'data'])
   * let debug_1 = dotenvM.add({ GOOOD: 'type', OF: 'data' })
   * console.log(debug.message) //=> [ADD_ERROR]: object must be [object Object] but received [object Array]
   * console.log(debug_1) //=> undefined
   *
   * // DEBUGGING #2
   * dotenvM.throwable = true
   *
   * try {
   *    dotenvM.add(['wrong', 'type', 'of', 'data'])
   * } catch(e) {
   *    console.log(e.message) //=> [ADD_ERROR]: object must be [object Object] but received [object Array]
   * }
   * ```
   */
  public add(obj: { [x: string]: string }, force = false): TypeError | undefined {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      const errorMessage = new TypeError(
        `[ADD_ERROR]: object must be [object Object] but received ${Object.prototype.toString.call(obj)}`
      )
      if (this.throwable) {
        throw errorMessage
      } else {
        return errorMessage
      }
    }
    for (const res of Object.entries(obj)) {
      const key = res[0]
      const val = res[1]
      if (!this.env[key]) {
        this.env[key] = val
        process.env[key] = val
      } else if (force) {
        this.env[key] = val
        process.env[key] = val
      }
    }
    this.__save()
  }
  /**
   * Remove variable from `.env` file and `process.env`
   * @param obj Key(s) you want to remove
   * @example
   * ```js
   * // #1
   * dotenvM.remove('REMOTE')
   * dotenvM.remove('PORT')
   *
   * // #2
   * dotenvM.remove( { REMOTE: 'value that dotenvM wont read', PORT: 'no.. really it doesnt care' } )
   *
   * // #3
   * dotenvM.remove(['REMOTE', 'PORT'])
   * ```
   */
  public remove(obj: { [x: string]: string } | string | string[]): TypeError | undefined {
    if (typeof obj === 'string') {
      delete process.env[obj]
      delete this.env[obj]
    } else if (Object.prototype.toString.call(obj) === '[object Object]') {
      for (const key of Object.keys(obj)) {
        delete process.env[key]
        delete this.env[key]
      }
    } else if (Array.isArray(obj)) {
      for (const key of obj) {
        delete process.env[key]
        delete this.env[key]
      }
    } else {
      const errorMessage = new TypeError(
        `[REMOVE_ERROR]: expected [object Object] or [object Array] or [String] but received ${Object.prototype.toString.call(
          obj
        )}`
      )
      if (this.throwable) {
        throw errorMessage
      } else {
        return errorMessage
      }
    }
    this.__save()
  }
  private __sort() {
    const order: {
      [x: string]: string
    } = {}
    for (const key of Object.keys(this.env).sort()) {
      order[key] = this.env[key]
    }
    this.env = order
  }
  private __save() {
    this.__sort()
    let string = ''
    for (const key in this.env) {
      if (Object.prototype.hasOwnProperty.call(this.env, key)) {
        const val = this.env[key]
        string += key + '=' + val + '\n'
      }
    }
    if (string.length) {
      fs.writeFileSync(this.env_path, string, { encoding: this.encoding })
    } else {
      if (Object.keys(this.env).length === 0) {
        fs.writeFileSync(this.env_path, string, { encoding: this.encoding })
      }
    }
  }
}

export default Manipulator
