/**
 * Created by gonzalo on 19-04-15.
 */
var validacionCorreo = false;
var validacionUsuario = false;

$(function() {

    // Eventos
    $("#country").change(function(){
        var countryCode = $("#country option:selected").val();
        cargarCiudades(countryCode);
    });

    $('#username').focusout(function(){
        comprobarUsername();
    });

    $('#email').focusout(function(){
        comprobarEmail();
    });


    // Funciones
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
    }


    function comprobarUsername()
    {
        var username = $('#username').val();
        $.ajax({
            url: '/user/check/'+username,
            type: 'GET',
            dataType: 'html',
            success: function(respuesta) {
                if (respuesta == 1) {
                    usuarioNuevo();
                }
                else{
                    usuarioExistente();
                }
            }
        });
    }

    function comprobarEmail()
    {
        var email = $('#email').val();
        $.ajax({
            url: '/user/checkEmail/'+email,
            type: 'GET',
            dataType: 'html',
            success: function(respuesta) {
                if (respuesta == 1) {
                    correoNuevo();
                }
                else{
                    correoExistente();
                }
            }
        });
    }

    function usuarioExistente()
    {
        $('#usuarioDisponible').fadeOut("slow").addClass('filaoculta');
        $('#usuarioNoDisponible').fadeIn("slow").removeClass('filaoculta');
        validacionUsuario = false;
        $('#username').focus();
    }

    function usuarioNuevo()
    {
        $('#usuarioNoDisponible').fadeOut("slow").addClass('filaoculta');
        $('#usuarioDisponible').fadeIn("slow").removeClass('filaoculta');
        $('#usuarioDisponible').delay( 3000 ).slideUp( 300 );
        validacionUsuario = true;
    }

    function correoExistente()
    {
        $('#correoNoDisponible').fadeIn("slow").removeClass('filaoculta');
        validacionCorreo = false;
        $('#email').focus();
    }

    function correoNuevo()
    {
        $('#correoNoDisponible').fadeOut("slow").addClass('filaoculta');
        validacionCorreo = true;
    }

});

// validaciones
$(document).foundation({
    abide : {
        live_validate : false,
        focus_on_invalid : true,
        error_labels: false, // labels with a for="inputId" will recieve an `error` class
        timeout : 1000,
        validators: {
            valUsername: function(el, required, parent) {
                return validacionUsuario;
            },
            valEmail: function(el, required, parent) {
                return validacionCorreo;
            }
        }
    }
});