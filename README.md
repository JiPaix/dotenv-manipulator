<h1 align="center"><img src='docs/dotenv-logo-readme.png'/>
  <p>
    <a href='https://travis-ci.com/JiPaix/dotenv-manipulator'><img src='https://travis-ci.com/JiPaix/dotenv-manipulator.svg?branch=master' alt="Build Status"/></a>
    <a href="https://snyk.io/test/github/JiPaix/dotenv-manipulator?targetFile=package.json"><img src="https://snyk.io/test/github/JiPaix/dotenv-manipulator/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/JiPaix/dotenv-manipulator?targetFile=package.json" style="max-width:100%;"></a>
    <a href="https://deepscan.io/dashboard#view=project&tid=8945&pid=13382&bid=223483"><img src="https://deepscan.io/api/teams/8945/projects/13382/branches/223483/badge/grade.svg" alt="DeepScan grade"></a>
    <img src='https://img.shields.io/npm/dm/dotenv-manipulator.svg' alt="NPM download count">
    <a href="https://codeclimate.com/github/JiPaix/dotenv-manipulator/maintainability"><img src='https://api.codeclimate.com/v1/badges/a9b5799c789bfa8d2350/maintainability' alt="Code Climate Maintainability"></a>
    <a href="https://discord.gg/5K7nEvK"><img src="https://img.shields.io/discord/706018150520717403" alt="Discord badge"></a>
  </p>
</h1>

# Introduction
<b>dotenv-Manipulator :</b>
- Loads environment variables from a `.env` file to `process.env`
- Adds, updates, or removes variables from both your .env file and process.env at runtime
- Has no dependency <small>(you don't need the `dotenv` package)</small>

# Installation
```console
npm i dotenv-manipulator
```

## Import/require
```js
const Manipulator = require('dotenv-manipulator')
// or
import Manipulator from 'dotenv-manipulator'
```

## Setup and start

Manipulator constructor has 3 optional arguments:
```js
new Manipulator(envPath, throwable, encoding)
```
- Path to `.env`, default is `__dirname`.
- If set to `true` functions throw errors whenever there's an incorrect input.
- Specify file encoding, default is `utf8`.

```js
// basic setup
const Manipulator = require('dotenv-manipulator')
const dotenvM = new Manipulator()
```

```js
// complete setup
const Manipulator = require('dotenv-manipulator')
const dotenvM = new Manipulator('/path/to/project', false, 'utf-8')
```

```js
// undefined = default value
const Manipulator = require('dotenv-manipulator')
const dotenvM = new Manipulator(undefined, true, 'latin1')
```

# Manipulate
## Add

Add object keys and values to .env file and process.env
```js
const obj = { REMOTE: '95.81.123.228', PORT: 3000 }
dotenvM.add(obj)
console.log(process.env.REMOTE) //=> '95.81.123.228'
console.log(process.PORT) //=> '3000'
```
.env file :
```console
PORT=3000
REMOTE=95.81.123.228
```
## Update
To update a variable use 
```js
dotenvM.add(obj, true)
```
### Example
#### Before

- ```js
  console.log(process.env.REMOTE) //=> '95.81.123.228'
  ```

-  ```console
    PORT=300
    REMOTE=95.81.123.228
    ```

#### Then
```js
dotenvM.add({ REMOTE : '38.10.10.25' }, true)
```
#### After
- ```js
  console.log(process.env.REMOTE) //=> '38.10.10.25'
  ```
- ```console
  PORT=300
  REMOTE=38.10.10.25
  ```

## Remove
Remove variable(s) from `.env` file and `process.env`
```js
dotenvM.remove(input)
```
Inputs are keys from an object, an array or a string :  
here's three way to achieve the same result.
```js

// #1
dotenvM.remove('REMOTE')
dotenvM.remove('PORT')

// #2
dotenvM.remove(['REMOTE', 'PORT'])

// #3
dotenvM.remove({ REMOTE: 'value that dotenvM wont read', PORT: 'no.. really it doesnt care' })
```
## Try catch and DEBUG
Here's two example :
```js
// DEBUGGING
dotenvM.throwable = false

let debug = dotenvM.add(['wrong', 'type', 'of', 'data'])
let debug_1 = dotenvM.add({ GOOOD: 'type', OF: 'data' })
console.log(debug.message)
//=> [ADD_ERROR]: object must be [object Object] but received [object Array]
console.log(debug_1)
//=> undefined
```
```js
// TRY CATCH
dotenvM.throwable = true

try {
  dotenvM.add(['wrong', 'type', 'of', 'data'])
} catch(e) {
  console.log(e.message)
  //=> [ADD_ERROR]: object must be [object Object] but received [object Array]
}
```
# API
Full documentation available [here](https://jipaix.github.io/dotenv-manipulator/classes/manipulator.html)