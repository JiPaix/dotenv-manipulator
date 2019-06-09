'use strict';

class Env {
    constructor() {
        this.fs = require('fs');
        require('dotenv-expand')(require('dotenv').config())
    }
    _add(key, value) {
        let prasedString = `${key.toUpperCase()}=${value}`;
        let stream = this.fs.createWriteStream('./.env', { flags: 'a' })
        stream.write(`${prasedString} \r\n`);
        process.env[key] = value;
    }
    del(key) {
        this.fs.readFile('./.env', 'utf8', (err, fileContent) => {
            if (err) throw err
            let newFileContent = fileContent.replace(new RegExp(`(\n|\r)^${key}.*$\s*(\n|\r)`, 'gim'), '')
            let stream = this.fs.createWriteStream('./.env', { flags: 'w' })
            stream.write(newFileContent)
            delete process.env[key]
        });
    }
    add(key, value) {
        this.del(key, () => {
            this._add(key, value)
        })
        process.env[key] = value;
    }
    update(key, value) {
        this.del(key, () => {
            this._add(key, value)
        })
        process.env[key] = value;
    }
}
const instance = new Env()
module.exports = Object.freeze(instance);
