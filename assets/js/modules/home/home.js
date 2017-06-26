/**
 * Created by @gnzandrs on 19-04-15.
 */
$(function() {

    // Eventos
    $( "#barraCarga" ).progressbar({
        value: false
    });

    $('#btnBuscar').click(function(){
        $('#deseos').empty();
        $('deseos').html($carga);
        cargarListaDeseos();
    });

    // Funciones
    function cargarListaDeseos()
    {
        $search = $('#search').val();

        // llamada al controlador
        $.ajax({
            url: '/search/' + $search,
            type: 'GET',
            dataType: 'html',
            async: true,
            beforeSend: function() {
                iniciarCarga();
            },
            error: function() {
                null;
            },
            success: function(respuesta) {
                terminarCarga();

                if (respuesta) {
                    $('#deseos').fadeIn("slow").html(respuesta);
                } else {
                    alert("Error al cargar deseos");
                }
            }
        });
    }

    function ultimosDeseos()
    {
        // llamada al controlador
        $.ajax({
            url: '/wish/latestAdded',
            //data: { tag: tagged },
            type: 'POST',
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
                    $('#deseos').html(respuesta);
                } else {
                    alert("Error al cargar los ultimos deseos añadidos");
                }
            }
        });
    }

    ultimosDeseos();
});

