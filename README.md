# dotenv-manipulator
[![NPM](https://nodei.co/npm/dotenv-manipulator.png?stars=true)](https://nodei.co/npm/dotenv-manipulator/)

 ![node](https://img.shields.io/node/v/dotenv-manipulator.svg) [![Build Status](https://travis-ci.com/JiPaix/dotenv-manipulator.svg?branch=master)](https://travis-ci.com/JiPaix/dotenv-manipulator) ![Sonar Quality Gate](https://img.shields.io/sonar/https/sonarcloud.io/JiPaix_dotenv-manipulator/quality_gate.svg) ![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/JiPaix/dotenv-manipulator.svg) ![npm](https://img.shields.io/npm/dm/dotenv-manipulator.svg)

`dotenv-manipulator` allows you to add, remove or update  **both** environment variables and .env files **on runtime**
using [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) as its core dependencies.
# Installation
```
npm i -S dotenv-manipulator
```
# Behavior
## `dotenv-manipator` will **always** :
* Converts keys to uppercase (input and ouput).
* Creates a `.env` file (when requiring) at the root of your project **if there's none**.
# Example
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1', (exist) => {
  if(exist)
    // do something
})
dotenvM.del('temporary_data', (doesntExist) => {
  if(doesntExist)
    // do something
})

dotenvM.update('node_env', 'production', (added) => {
  if(added)
    // do something
})
```
```javascript
const dotenvM = require('dotenv-manipulator')

let obj = {
  'first': 'one',
  'second': 'two',
  'third': 'three'
}

dotenvM.bulkAdd(obj, (exist) => {
  if(exist)
     // loop through keys that couldn't be added,
     // because they already exist. 
})
```
```javascript
const dotenvM = require('dotenv-manipulator')

let arr = ['second', 'third']

dotenvM.bulkUpdate(obj, (added) => {
  if(added)
     // loop through keys that have been added.
     // because they did not exist.
})
```
```javascript
const dotenvM = require('dotenv-manipulator')

let obj = {
  'first': 'one',
  'second': 'two',
  'fourth': 'four'
}

dotenvM.bulkDel(arr, (doesntExist) => {
  if(doesntExist)
     // loop through keys that couldn't be deleted,
     // because they are not set in the first place.
})
```
# API
>### add(key, value, callback)<h6>[index.js](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js), [line 200](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js#L200)</h6>
  - Adds a key if it's not defined in the *env*.
  - If it's already defined
    - `callback` returns an array containing the key
  - Else
    - `callback` variable is `undefined`

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| key      | String   | key name    |
| value    | String   | value       |
| callback | Callback |             |
#### Example :
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1', (exist) => {
    if(exist)
        // ['PUBLIC_IP']
})
```
>### del(key, callback)<h6>[index.js](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js), [line 220](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js#L220)</h6>
  - Deletes a key if it's defined in the *env*.
  - If the key is defined
    - `callback` returns an array containing the key
  - Else
    - `callback`'s returned variable is `undefined`

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| key      | String   | key name    |
| callback | Callback |             |
#### Example :
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.del('fruits', (notDefined) => {
    if(notDefined)
      // ['FRUITS']
})
```
>### update(key, value, callback)<h6>[index.js](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js), [line 240](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js#L240)</h6>
  - Updates a key if it's defined in the *env*.
  - If it's not defined
    - Acts as `add()` 
    - `callback` returns an array containing every added keys
  - else
    - `callback`'s returned variable is `undefined`

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| key      | String   | key name    |
| value    | String   | new value   |
| callback | Callback |
#### Example :
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.update('node_env', 'production', (added) => {
    if(added)
      // ['NODE_ENV']
})
```
>### bulkAdd(obj, callback)<h6>[index.js](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js), [line 95](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js#L95)</h6>
  - Adds keys that aren't defined in the *env*.
  - If one or more keys are already defined
    - They are skipped 
    - `callback` returns an array containing the key(s)
  - Else
    - `callback`'s returned variable is `undefined`

| Name     | Type                    | Description                       |
| -------- | ----------------------- | --------------------------------- |
| obj      | Object.<string, string> | Object containing keys and values |
| callback | Callback                |
#### Example :
```javascript
const dotenvM = require('dotenv-manipulator')

let obj = {
  'first': 'one',
  'second': 'two',
  'third': 'three' 
}

dotenvM.bulkAdd(obj, (exist) => {
    if(exist)
        // ['FIRST', 'SECOND']
})
```
>### bulkDel(arr, callback)<h6>[index.js](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js), [line 131](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js#L131)</h6>
  - Deletes keys that are defined in the *env*.
  - If one or more keys aren't defined
    - The key are skipped
    - `callback` returns an array containing the skipped key(s)
  - Else
    - `callback`'s returned variable is `undefined`

| Name     | Type           | Description                     |
| -------- | -------------- | ------------------------------- |
| arr      | Array.<string> | Array containing keys to delete |
| callback | Callback       |                                 |

#### Example :
```javascript
const dotenvM = require('dotenv-manipulator')

let arr = ['first', 'second', 'third']

dotenvM.bulkDel(arr, (notDefined) => {
    if(notDefined)
      // ['SECOND', 'THIRD']
})
```
>### bulkUpdate(obj, callback)<h6>[index.js](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js), [line 161](https://github.com/JiPaix/dotenv-manipulator/blob/master/index.js#L161)</h6>
  - Updates keys that are defined in the *env*.
  - If one or more key aren't defined
    - Acts as `add()` 
    - `callback` returns an array containing the added key(s)
  - Else
    - `callback`'s returned variable is `undefined`

| Name     | Type                    | Description                       |
| -------- | ----------------------- | --------------------------------- |
| obj      | Object.<string, string> | Object containing keys and values |
| callback | Callback                |

#### Example :
```javascript
const dotenvM = require('dotenv-manipulator')

let obj = {
  'first': 'one',
  'second': 'two',
  'third': 'three' 
}

dotenvM.bulkUpdate(obj, (added) => {
    if(added)
        // ['FIRST', 'THIRD']
})
```
