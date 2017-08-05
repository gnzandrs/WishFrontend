import $ from 'jquery';
import page from 'page';
import template from './wishlist.jade';
import modalTemplate from '../wish/wish.jade';
import foundation from 'foundation-sites';
import Dropzone from 'dropzone';
import GMaps from 'gmaps';
import { searchLocation, getMarkers, imageDelete, getCategories,
  createWish, createWishList }
  from '../wish-api-client';

page('/wishlist/create', create);

function create () {
  let selectedCategories = new Set();

  $('#main-container').html(template());

  $('#wishModal').html(modalTemplate());

  $('.listaDeseos')
      .html('Pulse sobre el boton para añadir un deseo.');

  $( "#frm-validaciones").submit(function (e) {
    e.preventDefault();
  });

  $(document)
    .on("invalid.zf.abide", function(ev,elem) {
      console.log("Field id "+ev.target.id+" is invalid");
    })
    .on('forminvalid.zf.abide', function (ev,frm) {
      console.log("Form id "+ev.target.id+" is invalid");
    })
    .on('formvalid.zf.abide', function (ev,frm) {

      let wishlist = {
        name: $('#name').val()
      };

      createWishList(wishlist, function (response) {
        if (response > 0) {
          $('#hdWishListId').attr('value', response);
          // wish modal
          $('#wishModal').foundation('open');
          setTimeout(chargeMap(), 2000);

        } else {
            console.log('error to create temporal wishlist');
        }
      });
    });

  $('#btn-anadir').on('click', function () {
    $( "#frm-validaciones").submit();
  });

  /* Dropzone */
  let myDropzone = new Dropzone("form#aw", {
      url: 'http://wish.app/api/wish/imageupload',
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

              removeButton.addEventListener("click", function (e) {
                  e.preventDefault();
                  e.stopPropagation();

                  // Remove the file preview.
                  _this.removeFile(file);
              });

              // Add the button to the file preview element.
              file.previewElement.appendChild(removeButton);

              // evento borrar imagen cargada
              //(aca deberia ir con un handler de <a> pero no funciona con el modal)
              let $formDropzone = $('#myModal')
                .find('.dz-preview')
                .find('.tiny');

              $formDropzone.on('click', function(e) {
                  let $this = $(this);
                  let nombre = $this.data('id');

                  imageDelete (function (response) {
                    console.log('image deleted.');
                  })
              });
          });
      }
  });

  myDropzone.on("sending", function (file, xhr, formData) {
    formData.append("token", localStorage.getItem('token'));
  });


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


  $('.btn-save')
    .append(  $(`<div id="btn-save" class="button big">Guardar</div>`)
    .on('click', function () {
        let description = $('#description').val();
        let reference = $('#reference').val();
        let price = $('#price').val();
        let list_id = $('#hdWishListId').val();
        let location_id = $('#hdIdLocation').val();

        let category_id = [];

        selectedCategories.forEach((value) => {
          category_id.push(value);
        });

        let wish = {
          description: description,
          reference: reference,
          price: price,
          list_id: list_id,
          location_id: location_id,
          category_id: category_id
        }

        createWish (wish, function (response) {
          if (response > 0) {
            $('#hfWishId').attr('value', response);
          } else {
            console.log("error al crear el deseo");
          }
        });
    }));

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
                  infoWindow: { content: response }
              })
          } else {
              console.log("No hay respuesta al buscar la localizacion")
          }
        });
    });


    getMarkers (function (response) {
      if (response) {
          for (let i in response.length) {
              map.addMarker({
                  lat: response[i].latitude,
                  lng: response[i].longitude,
                  infoWindow: { content: '<div id="ver"><br><center><label>' + response[i].name + '</label><center><br></div>' }
              });
          }
      } else {
          alert("Se ha producido un error al obtener los marcadores.")
      }
    });
  }

  $(document).foundation();
}
