import 'mocha'
import { expect } from 'chai'
import Manipulator from '../'
import * as fs from 'fs'
const dotenvM = new Manipulator(undefined)

const generate_random_string = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5)

const data = {
  [generate_random_string()]: 'one',
  [generate_random_string()]: 'two',
}

const keys = Object.keys(data)

describe('dotenv-manipulator', () => {
  it('add', () => {
    dotenvM.add(data, true)
    const size = fs.statSync(dotenvM.env_path).size
    expect(size).to.be.equal(20)
    expect(process.env[keys[0]]).to.be.equal(data[keys[0]])
  })

  it('removed', () => {
    dotenvM.remove(data)
    const size = fs.statSync(dotenvM.env_path).size
    expect(size).to.be.equal(0)
    expect(process.env[keys[0]]).to.be.undefined
    expect(process.env[keys[1]]).to.be.undefined
    expect(dotenvM.env[keys[0]]).to.be.undefined
    expect(dotenvM.env[keys[1]]).to.be.undefined
  })
})
