var $ = require('jquery')
var page = require('page')

var template = require('./intro.jade')

page('/intro', intro)

function intro () {
  $('.app-container').html(template())
  $('.sign-up').on('click', function () {
      page('/sign-up')
  })
}
