import $ from 'jquery';
import page from 'page';
import template from './wishlist.jade';
import wishTemplate from '../wish/wish.jade';
import locationTemplate from '../location/location.jade';
import foundation from 'foundation-sites';
import Dropzone from 'dropzone';
import GMaps from 'gmaps';
import { searchLocation, getMarkers, imageDelete, getCategories,
  createWish, createWishList, createLocation, getWishList }
  from '../wish-api-client';
import { getDate } from '../utils';

let selectedCategories = new Set();
let category_id = [];
let wishList = {
  id: 0,
  name: "",
  access: "",
  occasion: "",
  followers: 0,
  notification: 0,
  password: "",
  user_id: 0,
  created_at: "",
  updated_at: "",
  wishs: []
};

page('/wishlist/create', create);

function create () {
  $('#main-container').html(template());

  $('#modal-wish').html(wishTemplate());

  $('.listaDeseos')
      .html('Pulse sobre el boton para añadir un deseo.');

  $( "#frm-validaciones").submit(function (e) {
    e.preventDefault();
  });

  $( "#frm-wish").submit(function (e) {
    e.preventDefault();
  });

  $('#btn-anadir').on('click', function () {
    $( "#frm-validaciones").submit();
  });

  $('.btn-save')
    .empty()
    .append(  $(`<div id="btn-save" class="button big">Guardar</div>`)
    .on('click', function () {
        $( "#frm-wish").submit();
    }));

  $(document)
    .on("invalid.zf.abide", function(ev,elem) {
      console.log("Field id "+ev.target.id+" is invalid");
    })
    .on('forminvalid.zf.abide', function (ev,frm) {
      console.log("Form id "+ev.target.id+" is invalid");
    })
    .on('formvalid.zf.abide', function (ev,frm) {
      let formName = ev.target.id;

      // wishlist
      if (formName == "frm-validaciones") {
        createJsonWishList();
        $('#modal-wish').foundation('open');
        setTimeout(chargeMap(), 2000);
      }

      // wish
      if (formName == "frm-wish") {
        createJsonWish();
      }
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

    $categories.empty();

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

    // santiago location by default
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

        // if someone registered that location before, show that info
        searchLocation (lat, lng, function (response) {

            let locationModal = locationTemplate();

            if (JSON.parse(response).length == 0) {
              map.addMarker({
                  lat: lat,
                  lng: lng,
                  title: 'Marker #' + index,
                  infoWindow: { content: locationModal }
              })

              // wait for the render before add event
              setTimeout(function() {
                $('#btn-location').on('click', function () {
                  let locationName = $('#location-name').val();

                  let location = {
                    name: locationName,
                    latitude: lat,
                    longitude: lng
                  };

                  createLocation (location, function (response) {
                    if (response.created) {
                      $('#location-content')
                        .empty()
                        .append(`<h2>${location.name}</h2>`);
                    }
                    else {
                      console.log('error');
                    }
                  });
                })
              }, 2000);
            } else {
              // show
            }

        });
    });

    getMarkers (function (response) {
      response.forEach((value) => {
        map.addMarker({
            lat: value.latitude,
            lng: value.longitude,
            infoWindow: { content: '<h2>' + value.name + '</h2>' }
        });
      });
    });
  }

  $(document).foundation();
}

function createJsonWishList () {
  if (wishList.name == "") {
    wishList.name = $('#name').val();
  }
}

function createJsonWish () {
  let description = $('#description').val();
  let reference = $('#reference').val();
  let price = $('#price').val();
  let list_id = $('#hdWishListId').val();
  let location_id = $('#hdIdLocation').val();
  let id = getDate(); // temporal id

  let category_id = [];

  selectedCategories.forEach((value) => {
    category_id.push(value);
  });

  let wish = {
    id: id,
    description: description,
    reference: reference,
    price: price,
    date: "",
    list_id: 0,
    location_id: 0,
    category_id: 3, //temp...
    created_at: "",
    updated_at: ""
  };

  // add to wishlist
  wishList.wishs.push(wish);

  $('#modal-wish').foundation('close');
  refreshWishList();
  cleanModalFields();
}

function deleteJsonWish (wishId) {
  wishList.wishs.forEach((wish) => {
      if (wish.id == wishId) {
        wishList.wishs.splice(wish, 1);
      }
  });
  refreshWishList();
}

function refreshWishList () {
  let tableTemplate = `<table id="table-wishlist" class="stack">
      <thead>
        <tr>
          <th width="200">Descripcion</th>
          <th>Referencia</th>
          <th width="150">Fecha</th>
          <th width="150">Precio</th>
          <th width="150"></th>
        </tr>
      </thead>
      <tbody>
        :body:
        </tbody>
      </table>`;

    let $wishContainer = $('#wish-container');
    let wishRow = "";

    if (wishList.wishs.length > 0) {
      wishList.wishs.forEach((wish) => {
        wishRow += `<tr data-id="${wish.id}">
                    <td>${wish.description}</td>
                    <td>${wish.reference}</td>
                    <td>${wish.date}</td>
                    <td>${wish.price}</td>
                    <td>
                      <button type="button" class="success tiny button btn-edit">Editar</button>
                      <button type="button" class="alert tiny button btn-delete">Delete</button>
                    </td>
                    </tr>`;
      });

      let table = tableTemplate.replace(':body:', wishRow);

      $wishContainer.empty();
      $wishContainer.append(table);

      $('.btn-delete').on('click', function (e) {
        let wishId = $(this).parent().parent().data('id');
        deleteJsonWish(wishId);
        $(this).parent().parent().fadeOut();
        refreshWishList();
      });

      $('.btn-edit').on('click', function (e) {
        let dataId = $(this).parent().data('id');
      });
    } else {
      $wishContainer.html('<p>Pulse el boton para agregar deseos.</p>');
    }
}

function cleanModalFields () {
  $('#description').val('');
  $('#reference').val('');
  $('#price').val('');
  $('#hdWishListId').val('');
  $('#hdIdLocation').val('');
}
