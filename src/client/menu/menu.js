let $           = require('jquery');
let page        = require('page');
let layoutMenu  = require('./menu.jade');

export function menu () {
  $('#menu-container').html(layoutMenu());

  $('.menu-create').on('click', function () {
    page('/wishlist/create')
  });

  $('.logout-button').on('click', function () {
    localStorage.removeItem('token');
    $('.menu').html("");
    $('#logout-modal').foundation('close');
    page('/');
  });
}
