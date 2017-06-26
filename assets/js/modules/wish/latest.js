/**
 * Created by gonzalo on 19-04-15.
 */
$(function() {

    // Eventos
    $( ".wishAddButton" ).click(function(){
        var id = $(this).data('id');
        cargarListasUsuario(id);
    });

    // Funciones
    function cargarListasUsuario(id)
    {
        var divName = 'wish-' + id;
        // llamada al controlador
        $.ajax({
            url: '/wishlist/list/user',
            type: 'POST',
            dataType: 'html',
            async: true,
            beforeSend: function() {
                null;
            },
            error: function() {
                null;
            },
            success: function(respuesta) {

                if (respuesta) {
                    $('#'+divName).html(respuesta);
                    $('#'+divName).mouseleave(function(){
                        $('#'+divName).html('');
                    });
                    //$('#'+divName).menu();
                    $('#wishId').val(id);
                } else {
                    alert("Error al cargar listas");
                }
            }
        });
    }
});