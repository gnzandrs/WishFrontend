let $ = require('jquery')
let page = require('page')
let template = require('./wishlist.jade')
let modalTemplate = require('../wish/wish.jade')
let foundation = require('foundation-sites')

page('/wishlist/create', create)

function create () {
  $('.app-container').html(template())

  $('.listaDeseos').html('Pulse sobre el boton para añadir un deseo.')
  $('#wishModal').html(modalTemplate())

  $(document).foundation()
}
