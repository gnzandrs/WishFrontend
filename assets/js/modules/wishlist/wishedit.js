/**
 * Created by @gnzandrs on 19-04-15.
 */
var nombreUbicacion = '';
var index;
var lat;
var lng;
var contenedor;

// funcion que guarda el valor de la ventana de agregar marcador
function setLocationName(location_name)
{
    alert("in: "+ location_name);
    nombreUbicacion = location_name;
    // gatilla guardado por ajax
    document.getElementById('btnSave').click();
}

function cargarMapa()
{
    // añadir mapa en santiago
    var map = new GMaps({
        div: '#map',
        lat: -33.4691199,
        lng: -70.641997
    });

    // evento click agregar marcador
    GMaps.on('click', map.map, function(event) {
        //event.preventDefault();
        index = map.markers.length;
        lat = event.latLng.lat();
        lng = event.latLng.lng();

        // llamada al controlador
        $.ajax({
            url: '/location/search/'+lat+'/'+lng,
            type: 'GET',
            // data: { lat: lat, lng: lng },
            dataType: 'html',
            async: false,
            beforeSend: function() {
                null;
            },
            error: function() {
                null;
            },
            success: function(respuesta) {
                if (respuesta) {
                    //alert(respuesta);
                    // agrega marcador
                    map.addMarker({
                        lat: lat,
                        lng: lng,
                        title: 'Marker #' + index,
                        infoWindow: { content: respuesta }
                    });
                } else {
                    alert("No hay respuesta");
                }
            }
        });

    });

    //cargar marcadores BD
    /*$.ajax({
        url: '/location/getMarkers',
        type: 'POST',
        dataType: 'JSON',
        success: function(respuesta) {
            if (respuesta) {
                for (var i = 0; i < respuesta.length; i++)
                {
                    map.addMarker({
                        lat: respuesta[i].latitude,
                        lng: respuesta[i].longitude,
                        infoWindow: { content: '<div id="ver"><br><center><label>' + respuesta[i].nombre + '</label><center><br></div>' }
                    });

                }
            } else {
                alert("Se ha producido un error al obetener los marcadores.");
            }
        }
    });*/

    // cargar marcador
    var wish_id = $('#hdIdWish').val();

    $.ajax({
        url: '/location/getLocationByWish',
        data: { id: wish_id },
        type: 'POST',
        dataType: 'JSON',
        success: function(respuesta) {
            if (respuesta) {
                 map.addMarker({

                        lat: respuesta.latitude,
                        lng: respuesta.longitude,
                        infoWindow: { content: '<div id="ver"><br><center><label>' + respuesta.nombre + '</label><center><br></div>' }
                    });


            } else {
                alert("Se ha producido un error al obetener los marcadores.");
            }
        }
    });

}

// esperar 2 segundos antes de inicializar el mapa
setTimeout(function(){cargarMapa()}, 2000);

function guardarDeseo()
{
    var description = $('#description').val();
    var reference = $('#reference').val();
    var price = $('#price').val();
    var list_id = $('#hdIdList').val();
    var location_id = $('#hdIdLocation').val();
    var category_id = $('#hdIdCategory').val();

    $.ajax({
        url: '/wish/store',
        type: 'POST',
        data: { description: description, reference: reference, price: price, list_id: list_id, location_id: location_id, category_id: category_id },
        dataType: 'html',
        success: function(respuesta) {
            if (respuesta != 0) {
                $('#myModal').foundation('reveal', 'close'); // cerrar modal deseo
            }
        }
    });
}

function actualizarDeseo()
{
    var wish_id = $('#hdIdWish').val();
    var description = $('#description').val();
    var reference = $('#reference').val();
    var price = $('#price').val();
    var list_id = $('#hdIdList').val();
    var location_id = $('#hdIdLocation').val();
    var category_id = $('#hdIdCategory').val();

    $.ajax({
        url: '/wish/update',
        type: 'POST',
        data: { id: wish_id, description: description, reference: reference, price: price, list_id: list_id, location_id: location_id, category_id: category_id },
        dataType: 'html',
        success: function(respuesta) {
            if (respuesta != 0) {
                $('#myModal').foundation('reveal', 'close'); // cerrar modal deseo
                // desplazar hacia arriba la pantalla y mostrar mensaje
                $('html, body').animate({'scrollTop': 0}, 400).promise().done(function () {
                    if (respuesta != 0) {
                        $('#guardarOk').fadeIn("slow").removeClass('filaoculta');
                        $('#guardarOk').delay( 4000 ).slideUp( 300 );
                    } else {
                        $('#guardarError').fadeIn("slow").removeClass('filaoculta');
                        $('#guardarError').delay( 4000 ).slideUp( 300 );
                    }
                });
            }
        }
    });
}

//	Eventos
$('.categoryLabel').click(function(){
    $('.categoryLabel').attr('class', 'Radius Secondary Label categoryLabel');
    var id = $(this).data('id');
    $('#cat_'+id).attr('class', 'Success Label categoryLabel');
    $('#hdIdCategory').val(id);
});

$( "#frmDeseo").submit(function(e){
    e.preventDefault();
});

$( "#frmDeseo").on('invalid', function () {
})
    .on('valid', function () {
        guardarDeseo();
    });

// guardar el deseo BD
$('#btnGuardarDeseo').click(function(){
    //$( "#frmDeseo").submit();
    actualizarDeseo();
});

// guardar ubicacion
$('#btnSave').click(function (){
    $.ajax({
        data: { latitude: lat, longitude: lng, name: nombreUbicacion},
        url: '/location/store',
        type: 'POST',
        dataType: 'html',
        success: function(respuesta) {
            if (respuesta) {
                // guardar id de la ubicacion para adjuntarlo en el deseo
                $('#hdIdLocation').val(respuesta);
                $('#contenidoUbicacion').html(nombreUbicacion);
            } else {
                alert("Se ha producido un error al guardar la ubicacion.");
            }
        }
    });
});

var myDropzone = new Dropzone("form#aw", {
    url: '/wish/imageUpload',
    paramName: "file",
    fileSizeBase: 1024,
    parallelUploads: 1,
    maxFiles: 25,
    maxFilesize: 10000,
    acceptedFiles: ".png, .jpg, .jpeg, .gif",
    addRemoveLinks: false,
    dictDefaultMessage: "Arrastrar imagenes aqui, o click para subir.",

    init: function () {


        // comportamiento al añadir una nueva imagen
        this.on("addedfile", function (file) {
            var _this = this;

            // crear boton quitar en el preview de las imagenes cargadas
            var removeButton = Dropzone.createElement("<a data-id='"+ file.name +"' class='tiny button'>Quitar</a>");

            // Listen to the click event
            removeButton.addEventListener("click", function (e) {
                // Make sure the button click doesn't submit the form:
                e.preventDefault();
                e.stopPropagation();

                // Remove the file preview
                _this.removeFile(file);
                // If you want to the delete the file on the server as well,
                // you can do the AJAX request here.

                /* evento borrar imagen cargada
                 (aca deberia ir con un handler de <a> pero no funciona con el modal) */
                var $this = $(this);
                var nombre = $this.data('id');
                var img_id = 0;

                $.ajax({
                    url: '/wish/imageDelete',
                    type: 'POST',
                    data: { imgName: nombre , imgId: img_id, wishId: wish_id},
                    dataType: 'html',
                    success: function(respuesta) {
                        //console.log('respuesta: ' + respuesta);
                    }
                });
            });

            file.previewElement.appendChild(removeButton);
        });

        // cargar imagenes almacenadas en la vista
        var wish_id = $('#hdIdWish').val();
        var _this = this;
        $.ajax({
            url: '/wish/imageList',
            data: { id: wish_id },
            type: 'POST',
            dataType: 'json',
            async: false,
            beforeSend: function() {
                null;
            },
            error: function() {
                console.log('error...');
            },
            success: function(imagenes) {
                for (var i in imagenes) {
                    var mockFile = { name: imagenes[i].img_name, size: imagenes[i].img_size };
                    _this.options.addedfile.call(_this, mockFile);
                    _this.options.thumbnail.call(_this, mockFile, imagenes[i].img_thumb);
                    mockFile.previewElement.classList.add('dz-success');
                    mockFile.previewElement.classList.add('dz-complete');

                    // boton quitar
                    var removeButton = Dropzone.createElement("<a data-id='"+ imagenes[i].img_id +"' data-name='"+ imagenes[i].img_name +"' data-size='"+ imagenes[i].img_size +"' class='tiny button'>Quitar</a>");
                    removeButton.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        /* evento borrar imagen cargada
                         (aca deberia ir con un handler de <a> pero no funciona con el modal) */
                        var $this = $(this);
                        var img_id = $this.data('id');
                        var nombre = $this.data('name');
                        var img_size = $this.data('size');

                        $.ajax({
                            url: '/wish/imageDelete',
                            type: 'POST',
                            data: { imgName: nombre , imgId: img_id, wishId: wish_id},
                            dataType: 'html',
                            success: function(respuesta) {
                                $preview = $this.closest('.dz-preview').remove();
                            }
                        });

                    });
                    mockFile.previewElement.appendChild(removeButton);
                }
            }
        });

    }
});

$(document).foundation(); // fix modal