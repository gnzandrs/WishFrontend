/**
 * Created by gonzalo on 19-04-15.
 */
var list_id = 0;

// Funciones Globales
function cargarListaDeseos()
{
    // llamada al controlador
    $.ajax({
        url: '/wish/wishlist',
        data: { id: list_id },
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
                $('#listaDeseos').html(respuesta);
            } else {
                alert("Error al cargar la lista de deseos");
            }
        }
    });
}

function limpiarImgTemporal()
{
    // llamada al controlador
    $.ajax({
        url: '/wish/imagesDelete',
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
                console.log('imagenes temp borradas ok');
            }
        }
    });
}

$(function() {

    list_id = $('#hdWishListId').val();

    // Eventos
    $( "#frmValidaciones").submit(function(e){
        e.preventDefault();
    });

    $( "#frmValidaciones").on('invalid.fndtn.abide', function () {
    })
        .on('valid.fndtn.abide', function () {
            // modal deseo
            $('#myModal').foundation('reveal', 'open', {
                url: '../wishShow',
                data: { id: list_id },
                type: 'POST',
                dataType: 'html'
            });
        });

    // añadir deseo
    $('#btnAnadir').click(function(){
        $( "#frmValidaciones").submit();
    });

    // añadir lista
    $('#btnCrearLista').click(function(){
        alert('update lista');
    });

    // al cerrar popup resfrescar deseos
    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
        var modal = $(this);
        cargarListaDeseos();
        limpiarImgTemporal();
    });

    cargarListaDeseos();
});