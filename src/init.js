const { appendFileSync, readFileSync, writeFileSync, existsSync } = require('fs')
const { execSync } = require('child_process')

const sh = (cmd) => execSync(cmd).toString('utf8')

const CMD = { CD_ISSUES: `cd issues` }
const GIT = {
  REV_PARSE: `git rev-parse --git-dir`,
  CHECKOUT_BRANCH: `git checkout --orphan issues`,
  RESET: `git reset --hard`,
  NEW_WORKDIR: `./scripts/git-new-workdir . issues`,
  ADD_CFG: `git add config.json`,
  COMMIT: `git commit -m init`,
  PUSH: `git push --set-upstream origin issues`
}

const PATHS = {
  CONFIG: `issues/config.json`,
  GITIGNORE: `.gitignore`,
  ISSUES: 'issues/'
}

const ERRORS = {
  FOLDER_EXISTS: `Issues folder already exists`,
  NOT_GIT_REPO: `This command should be run from the root of a git repo`
}

module.exports = () => {
  // check if this is a git repo
  if (sh(GIT.REV_PARSE).trim() === '.git') {
    // check if issues folder does already exist
    if (existsSync(PATHS.ISSUES)) {
      console.error(ERRORS.FOLDER_EXISTS)
    } else {
      // create new workdir and new "issues" orphan branch
      sh(`${GIT.NEW_WORKDIR} && ${CMD.CD_ISSUES} && ${GIT.CHECKOUT_BRANCH} && ${GIT.RESET}`)
      // create default issues config
      writeFileSync(PATHS.CONFIG, JSON.stringify({ autoPush: true }))
      // commit and push changes to the "issues" orphan branch
      sh(`${CMD.CD_ISSUES} && ${GIT.ADD_CFG} && ${GIT.COMMIT} && ${GIT.PUSH}`)
      // write issue folder to gitignore (existing or new)
      if (existsSync(PATHS.GITIGNORE)) {
        const gitignore = readFileSync(PATHS.GITIGNORE, 'utf8')
        if (gitignore.split('\n').indexOf(`${PATHS.ISSUES}`) === -1) {
          appendFileSync(PATHS.GITIGNORE, `\n${PATHS.ISSUES}\n`)
        }
      } else {
        writeFileSync(PATHS.GITIGNORE, `${PATHS.ISSUES}`)
      }
    }
  } else {
    console.log(sh(GIT.REV_PARSE).trim())
    console.error(ERRORS.NOT_GIT_REPO)
  }
}
