const { mkdirSync, existsSync, statSync } = require('fs')
const { execSync } = require('child_process')

const sh = cmd => execSync(cmd).toString('utf8')

module.exports = () => {
  if (sh(`git rev-parse --git-dir`).trim() === '.git') {
    // if (existsSync('issues') && statSync('issues').isDirectory()) {
    if (existsSync('issues')) {
      console.error('issues folder already exists')
    } else {
      mkdirSync('issues')
    }
  } else {
    console.log(sh(`git rev-parse --git-dir`).trim())
    console.error('this command should be run from the root of a git repo')
  }
}
