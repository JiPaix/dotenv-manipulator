# dotenv-manipulator
[![NPM](https://nodei.co/npm/dotenv-manipulator.png?stars=true)](https://nodei.co/npm/dotenv-manipulator/)

[![Build Status](https://travis-ci.com/JiPaix/dotenv-manipulator.svg?branch=master)](https://travis-ci.com/JiPaix/dotenv-manipulator)

`dotenv-manipulator` allows you to add, remove or update  **both** environment variables and .env files **on runtime**
using [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) as its core dependencies.
>dotenv-manipulator aka environment manipulation made easy for slackers

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
dotenvM.update('', 'production', () => {
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

>### del(key, value, [callback])
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
Updates an **existing** key from the *environment*.<br>`callback` is optional and return an error if you tried to update key that isn't in the *environment*.
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
