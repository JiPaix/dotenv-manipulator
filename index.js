'use strict';

class Env {
    constructor() {
        this.fs = require('fs');
        require('dotenv-expand')(require('dotenv').config())
    }
    addToEnv(key, value, callback) {
        let prasedString = `${key.toUpperCase()}=${value}`;
        let stream = this.fs.createWriteStream('./.env', { flags: 'a' })
        stream.write(`${prasedString} \r\n`);
        process.env[key] = value;
    }
    delFromEnv(key, callback) {
        this.fs.readFile('./.env', 'utf8', (err, fileContent) => {
            if (err) throw err
            let newFileContent = fileContent.replace(new RegExp(`(\n|\r)^${key}.*$\s*(\n|\r)`, 'gim'), '')
            let stream = this.fs.createWriteStream('./.env', { flags: 'w' })
            stream.write(newFileContent)
            delete process.env[key]
        });
    }
    updateEnv(key, value) {
        this.delFromEnv(key, () => {
            this.addToEnv(key, value)
        })
        process.env[key] = value;
    }
}
