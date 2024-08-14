<script lang="ts">
  import scryfall from "../../../../src/";
  import debounce from "$lib/debounce";

  let value = "";
  let cardImage = "https://cards.scryfall.io/back.png";
  let autocompleteDatalist: string[] = [];

  const onKeyup = debounce(() => {
    scryfall.autocomplete(value).then((catalog) => {
      autocompleteDatalist = [];

      catalog.forEach((name) => {
        autocompleteDatalist.push(name);
      });
    });
  });

  function onSearchInput(e: InputEvent) {
    const val = (e.target as HTMLInputElement)?.value;
    if (!val) {
      return;
    }

    if (!autocompleteDatalist.find((name) => name === val)) {
      return;
    }

    return scryfall
      .getCard(val, "name")
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
            on:input={onSearchInput}
            on:keyup={onKeyup}
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
