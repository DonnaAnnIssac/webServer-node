const path = require('path')

function router (url) {
  let ext = path.extname(url)
  url = (url === '/')
        ? './test/index.html' : (ext.length === 0)
        ? './test' + url + '.html' : './test' + url
  return url
}

module.exports = router
