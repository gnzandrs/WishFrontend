let $ = require('jquery')
let page = require('page')
let template = require('./wishlist.jade')
let modalTemplate = require('../wish/wish.jade')
let foundation = require('foundation-sites')
let Dropzone = require('dropzone')
let GMaps = require('gmaps')
let { searchLocation, getMarkers, imageDelete }
  = require('../wish-api-client')

page('/wishlist/create', create)

function create () {
  $('.app-container').html(template())

  $('.listaDeseos').html('Pulse sobre el boton para añadir un deseo.')
  $('#wishModal').html(modalTemplate())


  /* Dropzone */
  let myDropzone = new Dropzone("form#aw", {
      url: '/wish/imageUpload',
      paramName: "file",
      fileSizeBase: 1024,
      parallelUploads: 1,
      maxFiles: 25,
      maxFilesize: 10000,
      acceptedFiles: ".png, .jpg, .jpeg, .gif",
      //createImageThumbnails: true,
      addRemoveLinks: false,
      /*removedfile: function (file) {

          var _ref;
          return (_ref = file.previewElement) != null ? ref.parentNode.removeChild(file.previewElement) : void 0;
      },*/
      dictDefaultMessage: "Drop File(s) Here or Click to Upload",

      init: function () {
          this.on("addedfile", function (file) {
              var _this = this

              // boton quitar
              var removeButton = Dropzone.createElement("<a data-id='"+ file.name +"' class='tiny button'>Quitar</a>")

              // Listen to the click event
              removeButton.addEventListener("click", function (e) {
                  // Make sure the button click doesn't submit the form:
                  e.preventDefault()
                  e.stopPropagation()

                  // Remove the file preview.
                  _this.removeFile(file)
                  // If you want to the delete the file on the server as well,
                  // you can do the AJAX request here.
              })

              // Add the button to the file preview element.
              file.previewElement.appendChild(removeButton)

              /* evento borrar imagen cargada
              (aca deberia ir con un handler de <a> pero no funciona con el modal) */
              var $formDropzone = $('#myModal').find('.dz-preview').find('.tiny')
              $formDropzone.on('click', function(e) {
                  var $this = $(this)
                  var nombre = $this.data('id')

                  imageDelete (function (response) {
                    console.log('image deleted.')
                  })
              })
          })
      }
  })


  /* Gmaps */
  function chargeMap () {
    let lat, lng

    // santiago location
    var map = new GMaps({
        div: '#map-container',
        lat: -33.4691199,
        lng: -70.641997
    })

    // bookmark event
    GMaps.on('click', map.map, function(event) {
        //event.preventDefault()
        index = map.markers.length
        lat = event.latLng.lat()
        lng = event.latLng.lng()

        searchLocation (function (respuesta) {
          if (respuesta) {
              map.addMarker({
                  lat: lat,
                  lng: lng,
                  title: 'Marker #' + index,
                  infoWindow: { content: respuesta }
              })
          } else {
              console.log("No hay respuesta al buscar la localizacion")
          }
        })
    })

    //cargar marcadores BD
    getMarkers (function (response) {
      if (respuesta) {
          for (var i = 0; i < respuesta.length; i++)
          {
              map.addMarker({
                  lat: respuesta[i].latitude,
                  lng: respuesta[i].longitude,
                  infoWindow: { content: '<div id="ver"><br><center><label>' + respuesta[i].name + '</label><center><br></div>' }
              })
          }
      } else {
          alert("Se ha producido un error al obtener los marcadores.")
      }
    })
  }

  // wait two seconds before iniciate the map...
  setTimeout(function(){chargeMap()}, 2000)
  $(document).foundation()
}
