# dotenv-manipulator
`dotenv-manipulator` allows you to add, remove or update  **both** environment variables and .env files 
## Installation
```
npm i -S dotenv-manipulator
```
## Usage
```
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
```
process.env.NODE_ENV // returns "development"
process.env.TEMPORARY_DATA // returns "data to delete after (x)"
process.env.PUBLIC_IP // returns undefined
```
### AFTER

**.env**

```
NODE_ENV=production
PUBLIC_IP=255.255.0.1
```


**Environment variable *after* :**
```
process.env.NODE_ENV // returns "production"
process.env.TEMPORARY_DATA // returns undefined
process.env.PUBLIC_IP // returns "255.255.0.1"
```
## Methods in depth

>### <a name="add"></a>add(key, value)
Adds the key and its value to (dotenv and node) environment.
Can also be used to update as it overwrites existing variables
```
const dotenvM = require('dotenv-manipulator')
dotenvM.add('node_env', 'prod')
dotenvM.add('hostname', 'DOLPHIN')
```
**before**

dotenv file content :
 `NODE_ENV=dev`
 
node environment :
```
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
```
process.env.NODE_ENV//=> prod
process.env.HOSTNAME //=> DOLPHIN
```
>### del(key, value)
remove the key from the (dotenv and node) environment.
```
const dotenvM = require('dotenv-manipulator')
dotenvM.del('hostname')
process.env.HOSTNAME //=> undefined
```

>### update(key, value)
Just a convenient alias, act the same as [add()](#add)
```
const dotenvM = require('dotenv-manipulator')
dotenvM.del('hostname')
process.env.HOSTNAME //=> undefined
```
