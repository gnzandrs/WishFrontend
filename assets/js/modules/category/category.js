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
        $category = $('#hdCategory').val();

        // llamada al controlador
        $.ajax({
            url: '/category/search/' + $category + '/' + $search,
            //data: { search: $search },
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

});

