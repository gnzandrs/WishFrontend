var $ = require('jquery')
var page = require('page')
var template = require('./login.jade')

page('/login', login)

function login () {
  $('.app-container').html(template())
}
