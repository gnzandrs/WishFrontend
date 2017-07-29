let $ = require('jquery');
let page = require('page');
let template = require('./wishlist.jade');
let modalTemplate = require('../wish/wish.jade');
let foundation = require('foundation-sites');
let Dropzone = require('dropzone');
let GMaps = require('gmaps');
let { searchLocation, getMarkers, imageDelete, getCategories, saveWish }
= require('../wish-api-client');


page('/wishlist/create', create);

function create () {
  let selectedCategories = new Set();

  $('.app-container').html(template());
  $('#wishModal').html(modalTemplate());

  $('.listaDeseos')
      .html('Pulse sobre el boton para añadir un deseo.');

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
      dictDefaultMessage: "Arrastrar imagenes para cargar.",

      init: function () {
          this.on("addedfile", function (file) {
              let _this = this;

              // boton quitar
              let removeButton = Dropzone.createElement("<a data-id='"+ file.name +"' class='tiny button'>Quitar</a>");

              // Listen to the click event
              removeButton.addEventListener("click", function (e) {
                  // Make sure the button click doesn't submit the form:
                  e.preventDefault();
                  e.stopPropagation();

                  // Remove the file preview.
                  _this.removeFile(file);
              })

              // Add the button to the file preview element.
              file.previewElement.appendChild(removeButton);

              /* evento borrar imagen cargada
              (aca deberia ir con un handler de <a> pero no funciona con el modal) */
              let $formDropzone = $('#myModal')
                .find('.dz-preview')
                .find('.tiny');

              $formDropzone.on('click', function(e) {
                  let $this = $(this);
                  let nombre = $this.data('id');

                  imageDelete (function (response) {
                    console.log('image deleted.');
                  })
              })
          })
      }
  })


  /* Categories */
  getCategories(function (categories) {

    let $categories = $('.categories');

    $.each(categories, function() {
        $categories.append(
          $(`<span data-id="${this.id}" class="label secondary">${this.name}</span>`)
            .on('click', function () {
              let $this = $(this);
              $this.toggleClass('secondary primary');

              ($this.attr('class') == 'label primary') ?
                (selectedCategories.add( $this.attr('data-id'))) :
                  (selectedCategories.delete( $this.attr('data-id')));
            })
        );
    });
  });

  /* Gmaps */
  function chargeMap () {
    let lat, lng;

    // santiago location
    let map = new GMaps({
        div: '#map-container',
        lat: -33.4691199,
        lng: -70.641997
    })

    // bookmark event
    GMaps.on('click', map.map, function(event) {
        //event.preventDefault()
        let index = map.markers.length;
        lat = event.latLng.lat();
        lng = event.latLng.lng();

        searchLocation (lat, lng, function (response) {
          if (response) {
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


    getMarkers (function (response) {
      if (response) {
          for (let i in response.length) {
              map.addMarker({
                  lat: response[i].latitude,
                  lng: response[i].longitude,
                  infoWindow: { content: '<div id="ver"><br><center><label>' + response[i].name + '</label><center><br></div>' }
              })
          }
      } else {
          alert("Se ha producido un error al obtener los marcadores.")
      }
    });
  }

  $('#btn-save').on('click', function () {
    let wish = { }

    saveWish (wish, function (response) {
      // close modal
    })
  })

  // wait two seconds before iniciate the map...
  setTimeout(function(){chargeMap()}, 2000);
  $(document).foundation();
}
