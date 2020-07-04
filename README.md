# dotenv-manipulator
[![NPM](https://nodei.co/npm/dotenv-manipulator.png?compact=true)](npmjs.com/package/dotenv-manipulator)

![Build Status](https://img.shields.io/node/v/dotenv-manipulator.svg)
[![Build Status](https://travis-ci.com/JiPaix/dotenv-manipulator.svg?branch=master)](https://travis-ci.com/JiPaix/dotenv-manipulator)
 ![npm](https://img.shields.io/npm/dm/dotenv-manipulator.svg)

[![Maintainability](https://api.codeclimate.com/v1/badges/a9b5799c789bfa8d2350/maintainability)](https://codeclimate.com/github/JiPaix/dotenv-manipulator/maintainability)
[![](https://img.shields.io/discord/706018150520717403)](https://discord.gg/5K7nEvK)
`dotenv-manipulator` allows you to add, remove or update  **both** environment variables and .env files **on runtime**
using [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) as its core dependencies.
# Installation
```
npm i -S dotenv-manipulator
```
# Behavior
## `dotenv-manipator` will **always** :
* Converts keys to uppercase (input and ouput).
* Creates a `.env` file at the root of your project **if there's none**.
# Example
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1', (cant_add) => {
  if(cant_add)
    // you can't add a KEY that already exists.
    console.log(cant_add) //=> ['PUBLIC_IP']
})
dotenvM.del('temporary_data', (cant_delete) => {
  if(cant_delete)
    // you can't delete a KEY that doesn't exist.
    console.log(cant_delete) //=> ['TEMPORARY_DATA']
})

dotenvM.update('proxy', true, (cant_update) => {
  if(cant_update)
    // you can't update a KEY that doesn't exist.
    console.log(cant_update) //=> ['PROXY']
})
```
```javascript
let obj = {
  'first': 'one',
  'second': 'two',
  'third': 'three'
}

dotenvM.bulkAdd(obj, (failed) => {
  if(failed)
    console.log(failed) //=> ['first', 'third']
})
```
```javascript
let obj = {
  'first': 1,
  'second': 2,
  'fourth': 4
}

dotenvM.bulkUpdate(obj, (failed) => {
  if(failed)
    console.log(failed) //=> ['fourth']
})
```
```javascript
let arr = ['one', 'two', 'three', 'four'] // array of keys you want to delete

dotenvM.bulkDel(arr, (failed) => {
  if(failed)
     console.log(failed) //=> ['two', 'three']
})
```
# API
Full documentation available [here](https://jipaix.github.io/dotenv-manipulator/Env.html)