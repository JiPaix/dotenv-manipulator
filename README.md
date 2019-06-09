# dotenv-manipulator
[![NPM](https://nodei.co/npm/dotenv-manipulator.png?stars=true)](https://nodei.co/npm/dotenv-manipulator/)

[![Build Status](https://travis-ci.com/JiPaix/dotenv-manipulator.svg?branch=master)](https://travis-ci.com/JiPaix/dotenv-manipulator)

`dotenv-manipulator` allows you to add, remove or update  **both** environment variables and .env files
using [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) as its core dependencies.
>dotenv-manipulator aka environment manipulation made easy for slackers

## Installation
```
npm i -S dotenv-manipulator
```
## Usage
```javascript
const dotenvM = require('dotenv-manipulator')

dotenvM.add('public_ip', '255.255.0.1')
dotenvM.del('temporary_data')
dotenvM.update('node_env', 'production')
```

## Example (based on above code)
### BEFORE

**.env file :**
```
NODE_ENV=development
TEMPORARY_DATA=data to delete after (x)
```
**process.env :**
```javascript
process.env.NODE_ENV //=> "development"
process.env.TEMPORARY_DATA //=> "data to delete after (x)"
process.env.PUBLIC_IP //=> undefined
```
### AFTER

**.env**

```
NODE_ENV=production
PUBLIC_IP=255.255.0.1
```


**Environment variable *after* :**
```javascript
process.env.NODE_ENV //=> "production"
process.env.TEMPORARY_DATA //=> undefined
process.env.PUBLIC_IP //=> "255.255.0.1"
```
## Methods in depth

>### <a name="add"></a>add(key, value)
Adds the key and its value to (dotenv and node) environment.
Can also be used to update as it overwrites existing variables
```javascript
const dotenvM = require('dotenv-manipulator')
dotenvM.add('node_env', 'prod')
dotenvM.add('hostname', 'DOLPHIN')
```
**before**

dotenv file content :
 `NODE_ENV=dev`
 
node environment :
```javascript
process.env.NODE_ENV //=> dev
process.env.HOSTNAME //=> undefined
```

**after**

dotenv file :
```
HOSTNAME=DOLPHIN
NODE_ENV=development
```
node environment
```javascript
process.env.NODE_ENV//=> prod
process.env.HOSTNAME //=> DOLPHIN
```
>### del(key, value)
remove the key from the (dotenv and node) environment.
```javascript
const dotenvM = require('dotenv-manipulator')
dotenvM.del('hostname')
process.env.HOSTNAME //=> undefined
```

>### update(key, value)
Just a convenient alias, act the same as [add()](#add)
```javascript
const dotenvM = require('dotenv-manipulator')
dotenvM.update('node_env', 'prod')
process.env.NODE_ENV //=> 'prod'
```
