let $ = require('jquery')
let page = require('page')
let template = require('./sign-up.jade')
let { checkUsername, checkEmail, countriesList, citiesList, register }
  = require('../wish-api-client')

page('/sign-up', signUp)

function signUp () {
  $('#main-container').html(template())

  let $registerForm = $('.app-container').find('form')

  // username verification
  $registerForm.find('#username')
    .on('focusout', function () {
      let userName = this.value

      checkUsername (userName, function (available) {
        if (parseInt(available)) {
          $('#usuarioNoDisponible').fadeOut("slow").addClass('filaoculta');
          $('#usuarioDisponible').fadeIn("slow").removeClass('filaoculta');
          $('#usuarioDisponible').delay( 3000 ).slideUp( 300 );
        } else {
          $('#usuarioDisponible').fadeOut("slow").addClass('filaoculta');
          $('#usuarioNoDisponible').fadeIn("slow").removeClass('filaoculta');
          $('#username').focus();
        }
      })
    })
    .on('keypress', function () {
        $('#usuarioNoDisponible').fadeOut("slow").addClass('filaoculta');
        $('#usuarioDisponible').fadeOut("slow").addClass('filaoculta');
    })

  $registerForm.find('#email').on('focusout', function () {
    let email = $('#email').val()
    checkEmail (email, function (available) {
        if (parseInt(available)) {
          $('#correoNoDisponible').fadeOut("slow").addClass('filaoculta');
        } else {
          $('#correoNoDisponible').fadeIn("slow").removeClass('filaoculta');
          $('#email').focus();
        }
    })
  })

  // charge countries <select>
  $registerForm.find('#country')
    .on('change', function () {
      // charge cities <select>
      let citiesSelect = $('#city')
      let countryId = $('select[name=country]').val()
      citiesSelect
        .empty()
        .append($("<option />").val(0).text('-- Seleccionar Ciudad --'));

      if (parseInt(countryId, 10) !== 0) {
        citiesList(countryId, function (cities) {
          $.each(cities, function () {
            citiesSelect.append($("<option />").val(this.id).text(this.name))
          })
        })
      }
    })


  countriesList(function (countries) {
    $.each(countries, function() {
        $registerForm.find('#country').append($("<option />").val(this.id).text(this.name))
    })
  })

  $registerForm
    .submit(function (event) {
      event.preventDefault()

    let user = {
      username: $(this).find('input[id="username"]').val(),
      email:    $(this).find('input[id="email"]').val(),
      name:     $(this).find('input[id="name"]').val(),
      lastname: $(this).find('input[id="lastname"]').val(),
      genre:    $(this).find('input[name="genre"][type="radio"]:checked').val(),
      country_id:  $(this).find('select[name="country"]').val(),
      city_id:     $(this).find('select[name="city"]').val(),
      password: $(this).find('input[id="password"]').val(),
      password_confirmation: $(this).find('input[id="password_confirmation"]').val(),
    }

    register(user, function (response) {
      if (response.created == true) {
        page.redirect('/')
      } else {
        let errorsDiv = $('.errors')

        errorsDiv
          .empty()
          .removeClass('filaoculta')

        for (let key in response) {
          errorsDiv.append($("<p>").text(response[key]))
        }
      }
    })

    })

}
