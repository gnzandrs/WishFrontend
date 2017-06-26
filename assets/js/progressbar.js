/**
 * Created by @gnzandrs on 28-03-15.
 * desc: utiliza libreria de jquery-ui para trabajar con la barra de progreso
 */
$carga = $('#barraCarga');

function progreso()
{
    var val = $carga.progressbar( "value" ) || 0;

    $carga.progressbar( "value", val + 2 );

    if ( val < 99 ) {
        setTimeout( progreso, 50 );
    }
}

function iniciarCarga()
{
    $carga.removeClass('filaoculta');

    $carga.fadeIn("slow");
    $carga.progressbar( "value", 0 );
    progreso();

}

function terminarCarga()
{
    $carga.progressbar( "option", "value", 100 );
    $carga.fadeOut("slow");
}

