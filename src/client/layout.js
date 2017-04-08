var $ = require('jquery')
var page = require('page')

page('/', restrict, home)

function restrict(ctx, next) {
  console.log('Restricting!')
  console.log('Context :' + JSON.stringify(ctx))
  console.log('window.user :' + window.user)
  //if (!window.user) return page('/sign-up')
  return page('/intro')
  next()
}

function home() {
  console.log('Page navigating to: HOME')
  //$('.app-container').html('Home home!')
}
