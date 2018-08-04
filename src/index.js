const init = require('./init')

module.exports = ({ _: [cmd] }) => {
  if (cmd === 'init') {
    init()
  } else {
    console.error('command not recognised')
  }
}
