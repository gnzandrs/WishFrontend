/**
 * Created by gonzalo on 19-04-15.
 */
$(function() {

    // Variables
    var list_id = $('#hdWishListId').val();

    // Eventos
    $( "#frmValidaciones").submit(function(e){
        e.preventDefault();
    });

    $( "#frmValidaciones")
        .on('invalid.fndtn.abide', function () { })
        .on('valid.fndtn.abide', function () {
            guardarLista();

            // modal deseo
            $('#myModal').foundation('reveal', 'open', {
                url: 'wishShow',
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
    });

    // Funciones
    function guardarLista()
    {
        if (list_id == "0")
        {
            var name = $('#name').val();
            // llamada al controlador
            $.ajax({
                url: '/wishlist/store',
                type: 'POST',
                data: { name: name },
                dataType: 'html',
                async: false,
                beforeSend: function() {
                    null;
                },
                error: function() {
                    null;
                },
                success: function(respuesta) {
                    $('#hdWishListId').val(respuesta);
                    list_id = $('#hdWishListId').val();
                }
            });
        }
    }

    // Funciones
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

    // al cerrar popup resfrescar deseos
    $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
        var modal = $(this);
        cargarListaDeseos();
    });

    //cargarListaDeseos();
});