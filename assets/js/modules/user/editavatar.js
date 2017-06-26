/**
 * Created by @gnzandrs on 10-05-15.
 */
jQuery(function($){

    // Funciones
    function mostrarImagenCargada()
    {
        // llamada al controlador
        $.ajax({
            url: '/user/profile/imageCrop',
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
                $('#recortarImagen').html(respuesta);
            }
        });
    }

   // Configuraciones
    var settings = {
        url: "../../user/profile/imageUpload",
        dragDrop: false,
        fileName: "file",
        allowedTypes:"jpg,png,gif",
        returnType:"html",
        onSuccess:function(files,data,xhr)
        {
            $("#subirImagen").fadeOut("slow").addClass('filaoculta');
            mostrarImagenCargada();
            $('#recortarImagen').fadeIn("slow").removeClass('filaoculta');
        },
        showDelete: true,
        deleteCallback: function(data,pd)
        {
            for(var i=0;i<data.length;i++)
            {
                $.post("delete.php",{op:"delete",name:data[i]},
                    function(resp, textStatus, jqXHR)
                    {
                        //Show Message
                        $("#status").append("<div>Imagen Borrada</div>");
                    });
            }
            pd.statusbar.hide(); //You choice to hide/not.

        }
    }
    var uploadObj = $("#mulitplefileuploader").uploadFile(settings);


});