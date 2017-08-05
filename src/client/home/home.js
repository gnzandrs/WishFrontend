global.jQuery = require('jquery');
let $ = global.jQuery;
let foundation = require('foundation-sites');

import page from 'page';
import template from './home.jade';
import { menu } from '../menu/menu';
import { categoryList, category } from '../wish-api-client';

page('/home', home);

function home(ctx, next) {
    $('#main-container').html(template());
    menu();

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

    $(document).foundation();
}
