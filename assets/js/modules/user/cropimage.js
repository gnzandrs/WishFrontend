/**
 * Created by @gnzandrs on 10-05-15.
 */

jQuery(function($){

    // Eventos
    $("#btnAceptar").click(function(){
        grabarCrop();
    });

    // Create variables (in this scope) to hold the API and image size
    var jcrop_api,
        boundx,
        boundy,

    // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),

        xsize = $pcnt.width(),
        ysize = $pcnt.height();

    console.log('init',[xsize,ysize]);

    $('#target').Jcrop({
        onChange: updateCoords,
        onSelect: updatePreview,
        aspectRatio: xsize / ysize
    },function(){
        // Use the API to get the real image size
        var bounds = this.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        // Store the API in the jcrop_api variable
        jcrop_api = this;

        // Move the preview into the jcrop container for css positioning
        $preview.appendTo(jcrop_api.ui.holder);
    });

    function grabarCrop()
    {
        var $x =  $('#x').val();
        var $y =  $('#y').val();
        var $w =  $('#w').val();
        var $h =  $('#h').val();

        if(($x || $y || $w || $h) == "-1")
        {
            $('#mensajeAlerta').fadeIn("slow").removeClass('filaoculta');
            $('#mensajeAlerta').delay( 3000 ).slideUp( 300 );
        }
        else {
            // obtener width y height al cual el frontend achica la imagen original
            var $originalWidth = $('.jcrop-holder').css('width').replace('px', '');
            var $originalHeight = $('.jcrop-holder').css('height').replace('px', '');

            // llamada al controlador
            $.ajax({
                url: '/user/profile/imageCropApply',
                type: 'POST',
                data: { width: $originalWidth, height: $originalHeight, x: $x, y: $y, w: $w, h: $h },
                dataType: 'html',
                async: false,
                beforeSend: function() {
                    null;
                },
                error: function() {
                    null;
                },
                success: function(respuesta) {
                    $('#modalAvatar').foundation('reveal', 'close'); // cerrar modal deseo
                }
            });
        }
    };

    function updatePreview(c)
    {
        updateCoords(c);

        if (parseInt(c.w) > 0)
        {
            var rx = xsize / c.w;
            var ry = ysize / c.h;

            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
        }
    };

    function updateCoords(c)
    {
        $('#x').val(c.x);
        $('#y').val(c.y);
        $('#w').val(c.w);
        $('#h').val(c.h);
    };

    function checkCoords()
    {
        if (parseInt($('#w').val())) return true;
        alert('Please select a crop region then press submit.');
        return false;
    };


});