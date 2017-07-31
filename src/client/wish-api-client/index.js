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
    fn (response)
  })
}

export function category (name, fn) {
  $.ajax({
    url:`${API_URL}category/${name}`,
    method: "GET",
    dataType: "json"
  }).done(function (response) {
    fn (response)
  })
}

export function searchLocation (lat, lng, fn) {
  $.ajax({
    url:`${API_URL}location/search/${lat}/${lng}`,
    method: "GET",
    dataType: "html",
    async: false,
  }).done(function (response) {
    fn (response)
  })
}

export function getMarkers (fn) {
  $.ajax({
    url:`${API_URL}location/getmarkers`,
    method: "GET",
    dataType: "json"
  }).done(function (response) {
    fn (response)
  })
}

export function imageDelete (name, fn) {
  let token = localStorage.getItem('token');
  $.ajax({
    url:`${API_URL}wish/delete-image`,
    method: "POST",
    data: { name: name, token: token},
    dataType: "html"
  }).done(function (response) {
    fn (response)
  });
}

export function getCategories (fn) {
  $.ajax({
    url:`${API_URL}category`,
    method: "GET",
    dataType: "json"
  }).done(function (response) {
    fn (response)
  }).fail(function () {
    fn ('error')
  });
}

export function createWishList (wishId, fn) {
  $.ajax({
    url:`${API_URL}wishlist`,
    method: "POST",
    data: { wishId : wishId },
    dataType: "json"
  }).done(function (response) {
    fn (response)
  }).fail(function () {
    fn ('error')
  });
}

export function createWish (wish, fn) {
  $.ajax({
    url: `${API_URL}wish`,
    method: "POST",
    data: { wish : wish },
    dataType: "json"
  }).done(function (response) {
    fn (response)
  }).fail(function () {
    fn ('error')
  });
}
