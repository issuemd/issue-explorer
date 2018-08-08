const { appendFileSync, readFileSync, writeFileSync, existsSync } = require('fs')
const { execSync } = require('child_process')

const sh = (cmd) => execSync(cmd).toString('utf8')

module.exports = () => {
  if (sh(`git rev-parse --git-dir`).trim() === '.git') {
    // if issues folder does not already exist
    // and issues branch does not already exist
    // and remote issues branch does not exist
    // and workdir is clean
    if (existsSync('issues')) {
      console.error('issues folder already exists')
    } else {
      sh(`./scripts/git-new-workdir . issues && cd issues && git checkout --orphan issues && git reset --hard`)
      writeFileSync(
        'issues/config.json',
        JSON.stringify({
          autoPush: true
        })
      )
      sh(`cd issues && git add config.json && git commit -m init && git push --set-upstream origin issues`)
      if (existsSync('.gitignore')) {
        const gitignore = readFileSync('.gitignore', 'utf8')
        if (gitignore.split('\n').indexOf('/issues/') === -1) {
          appendFileSync('.gitignore', '\n/issues/\n')
        }
      } else {
        writeFileSync('.gitignore', '/issues/')
      }
    }
  } else {
    console.log(sh(`git rev-parse --git-dir`).trim())
    console.error('this command should be run from the root of a git repo')
  }
}
