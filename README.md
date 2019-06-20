# dotenv-manipulator
[![NPM](https://nodei.co/npm/dotenv-manipulator.png?stars=true)](https://nodei.co/npm/dotenv-manipulator/)

[![Build Status](https://travis-ci.com/JiPaix/dotenv-manipulator.svg?branch=master)](https://travis-ci.com/JiPaix/dotenv-manipulator)

`dotenv-manipulator` allows you to add, remove or update  **both** environment variables and .env files **on runtime**
using [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) as its core dependencies.

# Installation
```
npm i -S dotenv-manipulator
```
# Usage
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1')
dotenvM.del('temporary_data')
dotenvM.update('node_env', 'production')

dotenvM.add('fruits', 'apple', () => {
    // ...
})
dotenvM.del('vegetable', () => {
    // ...
})
dotenvM.update('public_ip', '101.101.0.1', () => {
    // ...
})
```
# Behavior
## Before :
| .env                   | node                              |
| ---------------------- | --------------------------------- |
| `NODE_ENV=development` | `process.env.NODE_ENV //=> "dev"` |
| `FRUITS=apple`         | `process.env.FRUITS //=> "apple"` |
## Code applied :
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1')
dotenvM.del('fruits')
dotenvM.update('node_env', 'production')
```
## After :
| .env                    | node                                       |
| ----------------------- | ------------------------------------------ |
| `NODE_ENV=production`   | `process.env.NODE_ENV //=> "production"`   |
| `PUBLIC_IP=255.255.0.1` | `process.env.PUBLIC_IP //=> "255.255.0.1"` |

## API
For a better understanding from here *`environment`* will refer to both your `.env` file and your node environment aka `process.env`
>### <a name="add"></a>add(key, value, [callback])
Adds a key/value pair, **only if** the key isn't already set in the *environment*.<br>`callback` is optional and return an error if you try to add a key that is already in the *environment*.
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1', (err) => {
    if(err)
        throw err
    //=> code
})

// is the same as
dotenvM.add('public_ip', '255.255.0.1')
// but without you being aware if this failed or not.
```

>### remove(key, value, [callback])
Removes an **existing** key from the *environment*.<br>`callback` is optional and return an error if you tried to remove key that isn't in the *environment*.
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.del('fruits', (err) => {
    if(err)
        throw err
    //=> code
})

// is the same as
dotenvM.del('fruits')
// but without you being aware if this failed or not.
```

>### update(key, value, [callback])
Updates an **existing** key from the *environment*. Adds it if non-existant<br>`callback` is optional and return an error if you tried to update key that isn't in the *environment*.
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.update('node_env', 'production', (err) => {
    if(err)
        throw err
    //=> code
})

// is the same as
dotenvM.update('development', 'production')
// but without you being aware if this failed or not.
```

>### bulkAdd(obj, [callback])
Takes an object and adds its keys and values to the *environment*, **ignore** keys already in it.<br>`callback` is optional and called when the *environment* is updated, returns an array listing ignored keys.
```javascript
const dotenvM = require('dotenv-manipulator')
let obj = {
  "first": "one"
  "second": "two" 
}

dotenvM.bulkAdd(obj, (err) => {
    if(err)
        throw err
    //=> code
})

// is the same as
dotenvM.bulkAdd(obj)
// but without you being aware if this failed or not.
```

>### bulkRemove(arr, [callback])
Takes an array of keys and remove them (and their values), **ignore** already non-existing keys.<br>`callback` is optional and called when the *environment* is updated, returns an array listing ignored keys.
```javascript
const dotenvM = require('dotenv-manipulator')
let arr = ['first', 'second']

dotenvM.bulkDel(arr, (err) => {
    if(err)
        throw err
    //=> code
})

// is the same as
dotenvM.bulkDel(obj)
// but without you being aware if this failed or not.
```

>### bulkUpdate(obj, [callback])
Takes an object and update values of existing keys to the *environment*, **adds** them if they aren't already in the *environment*.<br>`callback` is optional and called when the *environment* is updated, returns an array listing added (not updated) keys.
```javascript
const dotenvM = require('dotenv-manipulator')
let obj = {
  "first": "one"
  "second": "two" 
}

process.env.SECOND === undefined // true

dotenvM.bulkUpdate(obj, (err) => {
    if(err)
        throw err
    process.env.SECOND === undefined // false
    //=> code
})

// is the same as
dotenvM.bulkUpdate(obj)
// but without you being aware if this failed or not.
```
