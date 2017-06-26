let $ = require('jquery')
let page = require('page')

page('/', restrict)

function restrict(ctx, next) {

  let checkSession = localStorage.getItem('token')

  if (checkSession) {
    page('/home')
  } else {
    page('/intro')
  }

  next()
}
