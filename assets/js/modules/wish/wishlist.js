/**
 * Created by gonzalo on 19-04-15.
 */

// Variables
var list_id = $('#hdWishListId').val();

// Eventos
// borrar deseo
$('.btnBorrar').click(function(){
    var id = $(this).data('id');
    var row =  $(this).parents('tr');
    row.fadeOut(400);
    //$('#deseos').load();
    borrarDeseo(id);
});

// editar deseo
$('.btnEditar').click(function(){
    var id = $(this).data('id');
    editarDeseo(id);
});

// Funciones
function verDeseo(wishId)
{
    $.ajax({
        url: '/wish/show',
        data:{id: wishId },
        type: 'POST'
    });
}

function borrarDeseo(wishId)
{
    $.ajax({
        url: '/wish/destroy',
        data: { wishId: wishId },
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
            if(respuesta == 1)
            {
                //cargarListaDeseos();
                // desplazar hacia arriba la pantalla y mostrar mensaje
                $('html, body').animate({'scrollTop': 0}, 400).promise().done(function () {
                    if (respuesta != 0) {
                        $('#guardarOk').fadeIn("slow").removeClass('filaoculta');
                        $('#guardarOk').delay( 4000 ).slideUp( 300 );
                    } else {
                        $('#guardarError').fadeIn("slow").removeClass('filaoculta');
                        $('#guardarError').delay( 4000 ).slideUp( 300 );
                    }
                });
            }
        }
    });
}

function editarDeseo(wishId)
{
    $('#myModal').foundation('reveal', 'open', {
        url: '../../wish/edit',
        data: { list_id: list_id, wish_id: wishId },
        type: 'POST',
        dataType: 'html'
    });
}