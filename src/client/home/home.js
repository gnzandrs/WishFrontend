var $ = require('jquery')
var page = require('page')

var template = require('./home.jade')

page('/home', home)

function home(ctx, next) {
  $('.app-container').html(template())
}