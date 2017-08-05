import $ from 'jquery';
import page from 'page';
import template from './login.jade';
import { login } from '../wish-api-client';

page('/login', loginPage);

function loginPage () {
  $('#main-container').html(template());

  let $loginForm = $('#main-container').find('form');

  $loginForm
    .submit(function (event) {
      event.preventDefault();

      let $formData = $(this).serialize();

      login ($formData, function (response) {
        if (response.token) {
          localStorage.setItem('token', response.token);
          page.redirect('/home');
        } else {
          $('.errors')
            .empty()
            .removeClass('filaoculta')
            .append($("<p>").text(response.error));
        }
      });
    });
}
