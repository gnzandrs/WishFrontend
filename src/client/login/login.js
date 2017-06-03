let $ = require('jquery')
let page = require('page')
let template = require('./login.jade')
let { login } = require('../wish-api-client')

page('/login', loginPage)

function loginPage () {
  $('.app-container').html(template())

  let $loginForm = $('.app-container').find('form')

  $loginForm
    .submit(function (event) {
      event.preventDefault()

      let user = {
        email: $(this).find('input[id="email"]').val(),
        password: $(this).find('input[id="password"]').val()
      }

      login (user, function (response) {
        if (response == user.email) {
          page.redirect('/')
        } else {
          var errorsDiv = $('.errors')

          errorsDiv
            .empty()
            .removeClass('filaoculta')

          for (var key in response) {
            errorsDiv.append($("<p>").text(response[key]))
            console.log(key + ': ' + response[key])
          }
        }
      })
    })
}
