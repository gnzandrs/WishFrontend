/**
 * Created by gonzalo on 19-04-15.
 */
$(function(){

    // Eventos
    $('.btnEnlace').click(function(e){
        var id = $(this).data('id');
        var url = $('#hdUrl').val();
        var urlLista = url + '/user/wishlist/' + id;
        $('#urlLista').val(urlLista);
        $('#modalEnlance').foundation('reveal', 'open');
    });

    $('#btnCopiar').click(function(){
        var texto = $('#urlLista').val();

    });


    $( ".btnEliminar").click(function(e){
        var id = $(this).data('id');
        var row =  $(this).parents('tr');
        row.fadeOut(400);
        //$('#deseos').load();
        eliminarLista(id);
    });

    // Funciones
    function eliminarLista(id)
    {
        $.ajax({
            url: '/wishlist/destroy',
            data: { ListId: id },
            type: 'POST',
            dataType: 'html',
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
    }


});
