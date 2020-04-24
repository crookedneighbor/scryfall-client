"use strict";

import ScryfallClient from "../../";
import debounce from "./debounce";

const scryfall = new ScryfallClient();

const search = document.querySelector("#search-wrapper input");
const autocompleteDatalist = document.querySelector("#search-wrapper datalist");
const cardImage = document.querySelector("#card-wrapper img");

const showCode = document.querySelector("#search-wrapper #show-code");
const modal = document.querySelector("#code-modal");

search.addEventListener(
  "keyup",
  debounce(() => {
    scryfall
      .get("cards/autocomplete", {
        q: search.value,
      })
      .then((catalog) => {
        autocompleteDatalist.innerHTML = "";
        catalog.forEach((name) => {
          var option = document.createElement("option");
          option.value = name;
          autocompleteDatalist.appendChild(option);
        });
      });
  })
);

search.addEventListener("input", () => {
  var val = search.value;
  var options = autocompleteDatalist.querySelectorAll("option");

  for (var i = 0; i < options.length; i++) {
    if (options[i].value === val) {
      return scryfall
        .get("cards/named", {
          fuzzy: val,
        })
        .then((card) => {
          return card.getImage();
        })
        .then((img) => {
          cardImage.src = img;
          autocompleteDatalist.innerHTML = "";
        });
    }
  }
});

showCode.addEventListener("click", () => {
  modal.classList.add("is-active");
});

modal.querySelector(".modal-background").addEventListener("click", () => {
  modal.classList.remove("is-active");
});
