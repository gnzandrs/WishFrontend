import $ from 'jquery';
import page from 'page';
import template from './wishlist.jade';
import wishTemplate from '../wish/wish.jade';
import locationTemplate from '../location/location.jade';
import foundation from 'foundation-sites';
import Dropzone from 'dropzone';
import GMaps from 'gmaps';
import { searchLocation, getMarkers, imageDelete, getCategories,
  createWish, createWishList, createLocation, getWishList, createImageDirectory }
  from '../wish-api-client';
import { getDate } from '../utils';

let selectedCategories = new Set();
let category_id = [];
let tmpWishId = getDate();
let wishList = {
  id: tmpWishId,
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

  createImageDirectory(wishList.id, function (response) {
    if (!response.created) {
      console.log('se produjo un error al crear el directorio temporal de imagenes');
    }
  });

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
        let wishId = $('#hdWishId').val();
        if (wishId == 0)
        {
          // new
          createJsonWish();
        } else {
          // update
          updateJsonWish(wishId);
          $('#modal-wish').foundation('close');
        }

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
      params: { token: localStorage.getItem('token'),
                wishListId: wishList.id },

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

                      $('#hdLocationId').val(response.id);
                    }
                    else {
                      console.log('error to create location');
                    }
                  });
                })
              }, 2000);
            }
        });
    });

    getMarkers (function (response) {
      response.forEach((value) => {
        let locationContent = `<p>${value.name}</p>
                <input type="button" class="button tiny" value="Usar Lugar" id="btn-location"/>`;
        map.addMarker({
            lat: value.latitude,
            lng: value.longitude,
            infoWindow: { content: locationContent }
        });
      });
    });
  }

  $(document).foundation();

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
    let location_id = $('#hdLocationId').val();
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
      location_id: location_id,
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

  function updateJsonWish (wishId) {
    // search
    wishList.wishs.forEach((wish) => {
        if (wish.id == wishId) {
          let description = $('#description').val();
          let reference = $('#reference').val();
          let price = $('#price').val();
          let location_id = $('#hdLocationId').val();

          wish.description = description;
          wish.reference = reference;
          wish.price = price;
          wish.location_id = location_id;
          return;
        }
    });

    $('#hdWishId').val(0);
    refreshWishList();
  }

  function chargeWishModal (wishId) {
    // search
    let wish = {};
    wishList.wishs.forEach((w) => {
        if (w.id == wishId) {
          wish = w;
          return;
        }
    });

    // charge in modal
    $('#description').val(wish.description);
    $('#reference').val(wish.reference);
    $('#price').val(wish.price);

    $('#hdWishId').val(wishId);
    $('#hdLocationId').val(wish.location_id);

    // open modal
    $('#modal-wish').foundation('open');
    setTimeout(chargeMap(), 2000);
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
          let wishId = $(this).parent().parent().data('id');
          chargeWishModal(wishId);
        });

        $('.btnSaveWishList')
          .empty()
          .append(  $(`<div id="btn-save-wishlist" class="expanded button">Guardar</div>`)
          .on('click', function () {
              createWishListFromJson();
          }));


      } else {
        $wishContainer.html('<p>Pulse el boton para agregar deseos.</p>');
      }
  }

  function cleanModalFields () {
    $('#description').val('');
    $('#reference').val('');
    $('#price').val('');
    $('#hdWishListId').val('');
    $('#hdLocationId').val('');
  }

  function createWishListFromJson() {
    createWishList(wishList, function (response) {
      if (response.created) {

        wishList.wishs.forEach((wish) => {
          createWish(wish, function (res) {
            if (!res.created) {
              console.log("error creating wish");
            }
            page('/wishlist/create')
          });
        });
      } else {
        console.log("error to create the list");
      }
    });
  }
}
