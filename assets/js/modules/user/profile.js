/**
 * Created by gonzalo on 19-04-15.
 */
$(function() {

    // Eventos
    $("#btnAvatar").click(function(){

        // modal deseo
        $('#modalAvatar').foundation('reveal', 'open', {
            url: '../../user/profile/editAvatar',
            //data: { wishId: wishId },
            type: 'POST',
            dataType: 'html'
        });

    });

    $("#btnGuardar").click(function(){
        guardarCambios();
    });

    // combobox pais, ciudad
    $("#country").change(function(){
        var countryCode = $("#country option:selected").val();
        cargarCiudades(countryCode);
    });

    // Funciones
    function guardarCambios(notification)
    {
        var nombre = $('#name').val();
        var apellido = $('#lastname').val();
        var correo = $('#email').val();
        var genero = $('input[name=genre]:checked').val();
        var pais = $("#country option:selected").val();
        var ciudad = $("#city_id option:selected").val();

        // llamada al controlador
        $.ajax({
            url: '/user/profile/edit',
            data: { name: nombre, lastname: apellido, email: correo, genre: genero, city_id: ciudad },
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
                // desplazar hacia arriba la pantalla y mostrar mensaje
                $('html, body').animate({'scrollTop': 0}, 400).promise().done(function () {
                    if (respuesta == 1) {
                    $('#guardarOk').fadeIn("slow").removeClass('filaoculta');
                    $('#guardarOk').delay( 3000 ).slideUp( 300 );
                } else {
                    $('#guardarError').fadeIn("slow").removeClass('filaoculta');
                    $('#guardarError').delay( 3000 ).slideUp( 300 );
                }
            });
            }
        });
    };

    function cargarCiudades(countryCode)
    {
        // llamada al controlador
        $.ajax({
            url: '/user/citiesList',
            data: { code: countryCode },
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
                    $('#citiesSelect').html(respuesta);
                } else {
                    alert("Error al cargar la lista de deseos");
                }
            }
        });
    };

    function recargarAvatar()
    {

        var img_actual = $('.avatar img').attr('src');
        $('.avatar img').attr('src', 'http://faraonesinternacionales.com/css/images/cargando.gif');

        // llamada al controlador
        $.ajax({
            url: '/user/avatarImage',
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
                if (respuesta != "") {
                    // cabiar nombre de imagen en div por la nueva
                    var termino = img_actual.lastIndexOf("/");
                    var img_nueva = img_actual.substring(0, termino);
                    img_nueva = img_nueva + '/' + respuesta;

                    $('.avatar').fadeOut("slow");
                    $('.avatar img').attr('src', img_nueva + '?1.2.0');
                    $('.avatar').fadeIn("slow");

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

    // al cerrar popup resfrescar deseos
    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
        var modal = $(this);
        recargarAvatar();
    });

    navegacionMenu();

});
