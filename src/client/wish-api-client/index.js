var $ = require('jquery')

export function checkUsername ($username, fn) {
  $.ajax('http://wish.local/user/check/'+$username+'/', {
    success: function (response) {
      fn(response)
    }
  })
}

export function checkEmail ($email, fn) {
  $.ajax('http://wish.local/user/checkEmail/'+$email+'/', {
    success: function (response) {
      fn(response)
    }
  })
}

export function countriesList (fn) {
  $.ajax('http://wish.local/user/countrieslist/', {
    success: function (response) {
      fn(response)
    }
  })
}

export function citiesList ($country, fn) {
  $.ajax({
    url: 'http://wish.local/user/citiesList/',
    method: "POST",
    data: { code : $country },
    dataType: "json"
  }).done(function (response) {
    fn(response)
  });
}

export function register ($user, fn) {
  $.ajax({
    url: 'http://wish.local/user/register/',
    method: "POST",
    data: { user : $user },
    dataType: "json"
  }).done(function (response) {
    fn(response)
  });
}

export function login ($formData, fn) {
  $.ajax({
    url: 'http://wish.local/user/login/',
    method: "POST",
    data: $formData,
    dataType: "json"
  }).done(function (response) {
    fn(response)
  })
}
