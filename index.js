'use strict';

class Env {
    constructor() {
        this.fs = require('fs')
        require('dotenv-expand')(require('dotenv').config())
    }
    _add(key, value, callback) {
        let prasedString = `${key.toUpperCase()}=${value}`;
        let stream = this.fs.createWriteStream('./.env', { flags: 'a' })
        process.env[key] = value
        stream.write(`${prasedString} \r\n`, (err, written) => {
            if (callback) {
                callback();
            }
        })
    }
    _del(key, callback) {
        this.fs.readFile('./.env', 'utf8', (err, fileContent) => {
            if (err) throw err
            let newFileContent = fileContent.replace(new RegExp(`(\r\n|\n|\r)?^${key}=.*(\r\n|\n|\r)*`, 'gim'), '')
            let stream = this.fs.createWriteStream('./.env', { flags: 'w' })
            delete process.env[key]
            stream.write(newFileContent, () => {
                if (callback) {
                    callback();
                }
            })
        });
    }
    add(key, value) {
        this._del(key, () => {
            this._add(key, value)
        })
        process.env[key] = value;
    }
    update(key, value) {
        this._del(key, () => {
            this._add(key, value)
        })
        process.env[key] = value;
    }
    del(key) {
        this._del(key, null)
    }
}
const instance = new Env()
module.exports = Object.freeze(instance)
