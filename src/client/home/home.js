global.jQuery = require('jquery')
let $ = global.jQuery
let page = require('page')
let foundation = require('foundation-sites')

let template = require('./home.jade')
let menu = require('../menu/menu.jade')
let { categoryList, category }
  = require('../wish-api-client')

//const API_URL = 'http://wish.app/api/category/'

page('/home', home)

function home(ctx, next) {

    $('.app-container').html(template())
    $('.menu').html(menu())

    $('.menu-create').on('click', function () {
      page('/wishlist/create')
    })

    let $categories = $('.categories');

    categoryList(function (categories) {
      $.each(categories, function () {
        $categories.append($('<a />')
          .text(this.name)
          .addClass('primary label category')
          .attr('name', this.name)
          .on('click', function () {
            let $name = this.name;
              category ($name, function (wishs) {
                  $('.wishs').empty()
                  if (wishs.length > 0) {
                    $('.wishs').append('<ul class="small-block-grid-3"></ul>')
                    $.each(wishs, function () {
                      $('.small-block-grid-3').append('<li><div class="small-12 columns text-left wishDescription">' +
                      wish.description +
                      '</div></li>')
                    })
                  }
                  else {
                    $('.wishs').append('<p>No se han encontrado resultados para la categoria.</p>')
                  }
              })
          }))
      })
    });

    let wishs = $('.wishs');

    wishs.html('<br><p>No existen registros.<p>');

    $(document).foundation()

}
