'use strict'

var ScryfallClient = require('../../')
var debounce = require('./debounce')

var scryfall = new ScryfallClient()

var search = document.querySelector('#search-wrapper input')
var autocompleteDatalist = document.querySelector('#search-wrapper datalist')
var cardImage = document.querySelector('#card-wrapper img')

var showCode = document.querySelector('#search-wrapper #show-code')
var modal = document.querySelector('#code-modal')

search.addEventListener('keyup', debounce(function (event) {
  scryfall.get('cards/autocomplete', {
    q: search.value
  }).then(function (catalog) {
    autocompleteDatalist.innerHTML = ''
    catalog.forEach(function (name) {
      var option = document.createElement('option')
      option.value = name
      autocompleteDatalist.appendChild(option)
    })
  }).catch(function (e) {
    debugger;
  });
}))

search.addEventListener('input', function (event) {
  var val = search.value
  var options = autocompleteDatalist.querySelectorAll('option')

  for (var i = 0; i < options.length; i++) {
    if (options[i].value === val) {
      return scryfall.get('cards/named', {
        fuzzy: val
      }).then(function (card) {
        return card.getImage()
      }).then(function (img) {
        cardImage.src = img
        autocompleteDatalist.innerHTML = ''
      })
    }
  }
})

showCode.addEventListener('click', function () {
  modal.classList.add('is-active')
})

modal.querySelector('.modal-background').addEventListener('click', function () {
  modal.classList.remove('is-active')
})
