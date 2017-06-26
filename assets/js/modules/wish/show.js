/**
 * Created by gonzalo on 19-04-15.
 */

//var location_id = $('#hdLocationId').val();
var location_id = 13;
//alert(location_id);

function cargarMapa()
{
    // añadir mapa en santiago
    var map = new GMaps({
        div: '#map',
        lat: -33.4691199,
        lng: -70.641997
    });

    //cargar marcadores BD
    $.ajax({
        url: '/location/getLocation',
        type: 'POST',
        dataType: 'JSON',
        data: { id: location_id },
        success: function(respuesta) {
            if (respuesta) {

                map.addMarker({
                    lat: respuesta.latitude,
                    lng: respuesta.longitude,
                    infoWindow: { content: '<div id="ver">' + respuesta.name + '</div>' }
                });
            } else {
                // log error y alerta personalizada...
            }
        }
    });
}

// esperar 2 segundos antes de inicializar el mapa
setTimeout(function(){cargarMapa()}, 1000);