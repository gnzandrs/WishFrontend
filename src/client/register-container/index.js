import $ from 'jquery'

var $form = $('#register-form')
var $userNameContainer = $('.username')
var $userName = $userNameContainer.find('#username')
var $countryContainer = $form.find('.country')

$userName.on('focusout', function (event) {

    $.get('http://wish.local/user/check/' + $userName.val(), function (data) {
         var html;

         if (data == '0')
         {
            html = `<div class="message alert callout">
                Alerta: Éste nombre de usuario ya se encuentra registrado, escoge otro.
            </div>`
            $userNameContainer.fadeIn("slow").append(html)
         } else {
            html = `<div class="message success callout">
            El nombre de usuario se encuentra disponible!
            </div>`

            $userNameContainer.append(html).fadeIn("slow")
         }

         $userNameContainer.find('.message').delay( 3000 ).slideUp( 300 )
    })
})





export default $form