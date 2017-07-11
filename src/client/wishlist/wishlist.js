let $ = require('jquery')
let page = require('page')
let template = require('./wishlist.jade')

page('/wishlist/create', create)

function create () {
  $('.app-container').html(template())

  $('.listaDeseos').html('Pulse sobre el boton para añadir un deseo.')
}
