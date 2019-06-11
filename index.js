'use strict';

class Env {
    constructor() {
        this.fs = require('fs')
        require('dotenv-expand')(require('dotenv').config())
    }
    add(key, value, callback) {
        if (typeof process.env[key] === 'undefined') {
            let fileContent;
            this.fs.createReadStream('./.env').on('data', data => {
                fileContent = data.toString()
            }).on('close', () => {
                if (typeof fileContent !== 'undefined') {
                    if (!fileContent.match(new RegExp(`(\r\n|\n|\r)*^${key}=.*(\r\n|\n|\r)*`, 'gim'))) {
                        let prasedString = `${key.toUpperCase()}=${value}\r\n`;
                        let stream = this.fs.createWriteStream('./.env', { flags: 'a' })
                        stream.write(prasedString)
                        process.env[key] = value
                        stream.close()
                        if (typeof callback === 'function')
                            stream.on('close', () => {
                                callback();
                            })
                    } else {
                        if (typeof callback === 'function')
                            callback(`this key already exists in .env file`)
                    }
                } else {
                    let prasedString = `${key.toUpperCase()}=${value}\r\n`;
                    let stream = this.fs.createWriteStream('./.env', { flags: 'a' })
                    stream.write(prasedString)
                    stream.close()
                    process.env[key] = value
                    if (typeof callback === 'function')
                        stream.on('close', () => {
                            callback()
                        })
                }
            })
        } else {
            if (typeof callback === 'function')
                callback(`this key already exists in process.env`)
        }
    }
    del(key, callback) {
        if (typeof process.env[key] !== 'undefined') {
            let fileContent;
            this.fs.createReadStream('./.env').on('data', data => {
                fileContent = data.toString()
            }).on('close', () => {
                if (fileContent) {
                    let newFileContent = fileContent.replace(new RegExp(`^${key}=.*(\r\n|\n|\r)*`, 'gim'), '')
                    if (newFileContent !== fileContent) {
                        let stream = this.fs.createWriteStream('./.env', { flags: 'w' })
                        stream.write(newFileContent)
                        stream.close();
                        delete process.env[key]
                        if (typeof callback === 'function')
                            stream.on('close', () => {
                                callback();
                            })
                    } else {
                        if (typeof callback === 'function')
                            callback(`key not found in .env file`)
                    }
                } else {
                    if (typeof callback === 'function')
                        callback(`.env file is empty`)
                }
            })
        } else {
            if (typeof callback === 'function')
                callback(`key not found in process.env`)
        }
    }
    update(key, value, callback) {
        if (typeof process.env[key] !== 'undefined') {
            let fileContent;
            this.fs.createReadStream('./.env').on('data', data => {
                fileContent = data.toString()
            }).on('close', () => {
                if (fileContent) {
                    let prasedString = `${key.toUpperCase()}=${value}\r\n`;
                    let newFileContent = fileContent.replace(new RegExp(`^${key}=.*`, 'gim'), prasedString)
                    if (newFileContent !== fileContent) {
                        let stream = this.fs.createWriteStream('./.env', { flags: 'w' })
                        stream.write(newFileContent)
                        stream.close();
                        process.env[key] = value;
                        if (typeof callback === 'function')
                            stream.on('close', () => {
                                callback()
                            })
                    } else {
                        if (typeof callback === 'function')
                            callback(`key not found in .env file`)
                    }
                } else {
                    if (typeof callback === 'function')
                        callback(`.env file is empty`)
                }
            })
        } else {
            if (typeof callback === 'function')
                callback(`key not found in process.env`)
        }
    }
}

const instance = new Env()
module.exports = Object.freeze(instance)
