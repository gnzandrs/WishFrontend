/**
 * Created by @gnzandrs on 19-05-15.
 */
/**
 * Created by gonzalo on 19-04-15.
 */
$(function(){
    // Variables
    comprobarUltimo();
    var fila;

    // Eventos
    $("#pend1").on('click', function(){

    });

    $("#pend2").on('click', function(){
        $("#pendientes tbody tr:eq(2)").fadeOut("slow").addClass('filaoculta');
        $("#comprados tbody tr:eq(0)").fadeOut("slow").addClass('filaoculta');
        $('#myModal').foundation('reveal', 'open');
        $("#comprados thead tr:eq(0)").fadeIn("slow").removeClass('filaoculta');
        $("#comprados tbody tr:eq(2)").fadeIn("slow").removeClass('filaoculta');
        comprobarUltimo();
    });

    $("#pend3").on('click', function(){
        $("#pendientes tbody tr:eq(3)").fadeOut("slow").addClass('filaoculta');
        $("#comprados tbody tr:eq(0)").fadeOut("slow").addClass('filaoculta');
        $('#myModal').foundation('reveal', 'open');
        $("#comprados thead tr:eq(0)").fadeIn("slow").removeClass('filaoculta');
        $("#comprados tbody tr:eq(3)").fadeIn("slow").removeClass('filaoculta');
        comprobarUltimo();
    });

    // Funciones
    function comprobarUltimo()
    {
        // si corresponde al ultimo pendiente, arroja mensaje
        if ($('#pendientes tbody tr').length == 1)
        {
            var sinPendientes = "<center><img src='{{ asset('assets/img/regalos.jpg') }}' width='250' heigth='250'></center>";
            $('#pendientes').html(sinPendientes);
        }
    }

    function sinCompras()
    {
        $('#sinCompras').attr('class') = "filaoculta";
    }

    // cambiar estado comprado/pendiente deseo
    $('.btnEstado').click(function(){
        var id = $(this).data('id');
        var rowIndex = $(this).parent().parent().index();
        var nombre = $('#pendientes tr').eq(rowIndex).children( "td:eq(0)");
        var descripcion = $('#pendientes tr').eq(rowIndex).children( "td:eq(1)");
        cambiarEstado(id, rowIndex);
        comprobarUltimo();
    });

    function crearFila(tableName, wishId)
    {
        var $linea = $('<tr></tr>');
        $linea.append( $('<td></td>')
            //.attr({ id : 'posicion' + 1 + '1' }) // añadimos un atributo id
            .html('prueba')
        );
        $linea.append( $('<td></td>')
            //.attr({ id : 'posicion' + 1 + '1' }) // añadimos un atributo id
            .html('prueba2')
        );
        //$('#comprados').append($linea);
        $('#'+ tableName +' tr:last').after($linea).fadeIn("slow");
    }

    function cambiarEstado(wishId, rowIndex)
    {
        $.ajax({
            url: '/wish/changeStatus',
            data:{ id: wishId },
            type: 'POST',
            success: function(respuesta) {
                if(respuesta == 1)
                {
                    $("#pendientes tbody tr:eq("+ rowIndex +")").fadeOut("slow").addClass('filaoculta');
                    $('#myModal').foundation('reveal', 'open');
                    crearFila('comprados', wishId);
                    sinCompras();
                }
                else {
                    alert('Se produjo un error al cambiar el estado');
                }
            }
        });

    }

});
