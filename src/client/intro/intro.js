var $ = require('jquery')
var page = require('page')

var template = require('./intro.jade')

page('/intro', intro)

function intro () {

  let checkSession = localStorage.getItem('token');

  if (checkSession) {
    page('/home')
  }
  else {
    $('.app-container').html(template())

    $('.sign-up').on('click', function () {
        page('/sign-up')
    })

    $('.login').on('click', function () {
        page('/login')
    })
  }
}
