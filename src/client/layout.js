let $ = require('jquery')
let page = require('page')

page('/', restrict)

function restrict(ctx, next) {
  console.log('Restricting!')
  console.log('Context :' + JSON.stringify(ctx))

  let checkSession = localStorage.getItem('token')

  if (checkSession) {
    page('/home')
  } else {
    page('/intro')
  }

  next()
}
