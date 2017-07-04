var $ = require('jquery')

const API_URL = 'http://wish.app/api/'

export function checkUsername (username, fn) {
  $.ajax(`${API_URL}user/check/${username}`, {
    success: function (response) {
      fn(response)
    }
  })
}

export function checkEmail (email, fn) {
  $.ajax(`${API_URL}user/checkEmail/${email}`, {
    success: function (response) {
      fn(response)
    }
  })
}

export function countriesList (fn) {
  $.ajax(`${API_URL}user/countrieslist/`, {
    success: function (response) {
      fn(response)
    }
  })
}

export function citiesList (country, fn) {
  $.ajax({
    url: `${API_URL}user/citieslist/`,
    method: "POST",
    data: { code : country },
    dataType: "json"
  }).done(function (response) {
    fn(response)
  });
}

export function register (user, fn) {
  $.ajax({
    url: `${API_URL}user/register/`,
    method: "POST",
    data: { user : user },
    dataType: "json"
  }).done(function (response) {
    fn(response)
  });
}

export function login (formData, fn) {
  $.ajax({
    url: `${API_URL}user/login/`,
    method: "POST",
    data: formData,
    dataType: "json"
  }).done(function (response) {
    fn(response)
  })
}

export function categoryList (fn) {
  $.ajax({
    url: `${API_URL}category/`,
    method: "GET",
    dataType: "json"
  }).done(function (response) {
    fn(response)
  })
}
