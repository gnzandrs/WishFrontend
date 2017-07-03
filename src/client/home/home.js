global.jQuery = require('jquery')
let $ = global.jQuery
let page = require('page')
let foundation = require('foundation-sites')

let template = require('./home.jade')
let menu = require('../menu/menu.jade')

page('/home', home)

function home(ctx, next) {

    $('.app-container').html(template())
    $('.menu').html(menu())
    $(document).foundation()

}
