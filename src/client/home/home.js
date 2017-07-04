global.jQuery = require('jquery')
let $ = global.jQuery
let page = require('page')
let foundation = require('foundation-sites')

let template = require('./home.jade')
let menu = require('../menu/menu.jade')
let { categoryList }
  = require('../wish-api-client')

page('/home', home)

function home(ctx, next) {

    $('.app-container').html(template())
    $('.menu').html(menu())

    let $categories = $('.category')
    categoryList(function (categories) {
      $.each(categories, function () {
        $categories.append($("<a />").href(this.id).text(this.name))
      })
    })

    $(document).foundation()

}
