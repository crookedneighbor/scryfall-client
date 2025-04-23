<script lang="ts">
  import scryfall from "scryfall-client";
  import debounce from "$lib/debounce";

  let value = $state("");
  let cardImage = $state("https://cards.scryfall.io/back.png");
  let autocompleteDatalist: string[] = $state([]);

  const onKeyup = debounce(() => {
    scryfall.autocomplete(value).then((catalog) => {
      autocompleteDatalist = [];

      catalog.forEach((name) => {
        autocompleteDatalist.push(name);
      });
    });
  });

  function onSearchInput() {
    if (!value) {
      return;
    }

    if (!autocompleteDatalist.find((name) => name === value)) {
      return;
    }

    scryfall
      .getCard(value, "name")
      .then((card) => card.getImage())
      .then((img) => {
        cardImage = img;
        autocompleteDatalist = [];
      });
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css"
  />
</svelte:head>

<section class="section">
  <div class="container">
    <div class="columns">
      <div id="search-wrapper" class="column">
        <div class="field">
          <h1>Autocomplete</h1>
          <input
            list="autocomplete-cards"
            class="input is-large"
            oninput={onSearchInput}
            onkeyup={onKeyup}
            type="text"
            bind:value
            placeholder="Enter Card Name (Ex: Karn)"
          />

          <datalist id="autocomplete-cards">
            {#each autocompleteDatalist as data}
              <option value={data}></option>
            {/each}
          </datalist>
        </div>
      </div>
      <div class="column">
        <img src={cardImage} alt="" />
      </div>
    </div>
  </div>
</section>

<style>
  @import "./autocomplete.css";
</style>
