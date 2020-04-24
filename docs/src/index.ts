"use strict";

// TODO change this to import require when converted
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ScryfallClient = require("../../src/");
import debounce from "./debounce";

const scryfall = new ScryfallClient();

const search = document.querySelector(
  "#search-wrapper input"
) as HTMLInputElement;
const autocompleteDatalist = document.querySelector(
  "#search-wrapper datalist"
) as HTMLDataListElement;
const cardImage = document.querySelector(
  "#card-wrapper img"
) as HTMLImageElement;

const showCode = document.querySelector(
  "#search-wrapper #show-code"
) as HTMLParagraphElement;
const modal = document.querySelector("#code-modal") as HTMLDivElement;

search.addEventListener(
  "keyup",
  debounce(() => {
    scryfall
      .get("cards/autocomplete", {
        q: search.value,
      })
      // TODO change this from any[]
      .then((catalog: any[]) => {
        autocompleteDatalist.innerHTML = "";
        catalog.forEach((name) => {
          const option = document.createElement("option") as HTMLOptionElement;
          option.value = name;
          autocompleteDatalist.appendChild(option);
        });
      });
  })
);

search.addEventListener("input", () => {
  const val = search.value;
  const options = autocompleteDatalist.querySelectorAll("option");

  for (let i = 0; i < options.length; i++) {
    if (options[i].value === val) {
      return (
        scryfall
          .get("cards/named", {
            fuzzy: val,
          })
          // TODO change this from any
          .then((card: any) => {
            return card.getImage();
          })
          .then((img: string) => {
            cardImage.src = img;
            autocompleteDatalist.innerHTML = "";
          })
      );
    }
  }
});

showCode.addEventListener("click", () => {
  modal.classList.add("is-active");
});

(modal.querySelector(".modal-background") as HTMLDivElement).addEventListener(
  "click",
  () => {
    modal.classList.remove("is-active");
  }
);