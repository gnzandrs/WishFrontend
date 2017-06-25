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

      let $formData = $(this).serialize()

      login ($formData, function (response) {
        if (response.token) {
          localStorage.setItem('token', response.token)
          page.redirect('/home')
        } else {
          $('.errors')
            .empty()
            .removeClass('filaoculta')
            .append($("<p>").text(response.error))
        }
      })
    })
}
