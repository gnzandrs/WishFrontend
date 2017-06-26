/**
 * Created by gonzalo on 19-04-15.
 */
$(function() {

    // Eventos
    $("#btnGuardar").click(function(){
        var notification = $('input[name=notification]:checked').val();
        guardarCambios(notification);
    });

    // Funciones
    function guardarCambios(notification)
    {
        // llamada al controlador
        $.ajax({
            url: 'option/edit',
            data: { notificacion: notification },
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
                if (respuesta == 1) {
                $('#guardarOk').fadeIn("slow").removeClass('filaoculta');
                $('#guardarOk').delay( 3000 ).slideUp( 300 );
                } else {
                $('#guardarError').fadeIn("slow").removeClass('filaoculta');
                $('#guardarError').delay( 3000 ).slideUp( 300 );
                }
            }
            });
    }

    function navegacionMenu()
    {
        var url = $('#hdUrl').val();
        var inicio = url.lastIndexOf("/");
        var url_nueva = url.substring(inicio+1, url.length);

        if (url_nueva == 'profile')
        {
            $('#ulMenu li:eq(0)').addClass('unavailable');
            $('#ulMenu li:eq(0) a').attr('href', '#');
        }

        if (url_nueva == 'option')
        {
            $('#ulMenu li:eq(2)').addClass('unavailable');
            $('#ulMenu li:eq(2) a').attr('href', '#');
        }

    }

    navegacionMenu();
});
