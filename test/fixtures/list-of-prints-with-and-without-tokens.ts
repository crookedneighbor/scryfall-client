// https://api.scryfall.com/cards/search?order=released&q=oracleid%3A868882d2-ed4e-4171-a17c-478a341080fb&unique=prints&pretty=true
export const listOfPrintsWithAndWithoutTokensFixture = {
  object: "list",
  total_cards: 3,
  has_more: false,
  data: [
    {
      object: "card",
      id: "889c1a0f-7df2-4497-8058-04358173d7e8",
      oracle_id: "868882d2-ed4e-4171-a17c-478a341080fb",
      multiverse_ids: [442203],
      mtgo_id: 67342,
      mtgo_foil_id: 67343,
      tcgplayer_id: 161428,
      name: "Prossh, Skyraider of Kher",
      lang: "en",
      released_at: "2018-03-16",
      uri: "https://api.scryfall.com/cards/889c1a0f-7df2-4497-8058-04358173d7e8",
      scryfall_uri:
        "https://scryfall.com/card/a25/214/prossh-skyraider-of-kher?utm_source=api",
      layout: "normal",
      highres_image: true,
      image_uris: {
        small:
          "https://c1.scryfall.com/cards/small/front/8/8/889c1a0f-7df2-4497-8058-04358173d7e8.jpg?1562438016",
        normal:
          "https://c1.scryfall.com/cards/normal/front/8/8/889c1a0f-7df2-4497-8058-04358173d7e8.jpg?1562438016",
        large:
          "https://c1.scryfall.com/cards/large/front/8/8/889c1a0f-7df2-4497-8058-04358173d7e8.jpg?1562438016",
        png: "https://c1.scryfall.com/cards/png/front/8/8/889c1a0f-7df2-4497-8058-04358173d7e8.png?1562438016",
        art_crop:
          "https://c1.scryfall.com/cards/art_crop/front/8/8/889c1a0f-7df2-4497-8058-04358173d7e8.jpg?1562438016",
        border_crop:
          "https://c1.scryfall.com/cards/border_crop/front/8/8/889c1a0f-7df2-4497-8058-04358173d7e8.jpg?1562438016",
      },
      mana_cost: "{3}{B}{R}{G}",
      cmc: 6.0,
      type_line: "Legendary Creature — Dragon",
      oracle_text:
        "When you cast this spell, create X 0/1 red Kobold creature tokens named Kobolds of Kher Keep, where X is the amount of mana spent to cast Prossh.\nFlying\nSacrifice another creature: Prossh, Skyraider of Kher gets +1/+0 until end of turn.",
      power: "5",
      toughness: "5",
      colors: ["B", "G", "R"],
      color_identity: ["B", "G", "R"],
      all_parts: [
        {
          object: "related_card",
          id: "889c1a0f-7df2-4497-8058-04358173d7e8",
          component: "combo_piece",
          name: "Prossh, Skyraider of Kher",
          type_line: "Legendary Creature — Dragon",
          uri: "https://api.scryfall.com/cards/889c1a0f-7df2-4497-8058-04358173d7e8",
        },
        {
          object: "related_card",
          id: "dfc03591-1114-4e36-a397-0bb3db8a153c",
          component: "token",
          name: "Kobolds of Kher Keep",
          type_line: "Token Creature — Kobold",
          uri: "https://api.scryfall.com/cards/dfc03591-1114-4e36-a397-0bb3db8a153c",
        },
      ],
      legalities: {
        standard: "not_legal",
        future: "not_legal",
        historic: "not_legal",
        pioneer: "not_legal",
        modern: "not_legal",
        legacy: "legal",
        pauper: "not_legal",
        vintage: "legal",
        penny: "not_legal",
        commander: "legal",
        brawl: "not_legal",
        duel: "legal",
        oldschool: "not_legal",
      },
      games: ["paper", "mtgo"],
      reserved: false,
      foil: true,
      nonfoil: true,
      oversized: false,
      promo: false,
      reprint: true,
      variation: false,
      set: "a25",
      set_name: "Masters 25",
      set_type: "masters",
      set_uri:
        "https://api.scryfall.com/sets/41ee6e2f-69b3-4c53-8a8e-960f5e974cfc",
      set_search_uri:
        "https://api.scryfall.com/cards/search?order=set&q=e%3Aa25&unique=prints",
      scryfall_set_uri: "https://scryfall.com/sets/a25?utm_source=api",
      rulings_uri:
        "https://api.scryfall.com/cards/889c1a0f-7df2-4497-8058-04358173d7e8/rulings",
      prints_search_uri:
        "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A868882d2-ed4e-4171-a17c-478a341080fb&unique=prints",
      collector_number: "214",
      digital: false,
      rarity: "mythic",
      watermark: "set",
      card_back_id: "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
      artist: "Todd Lockwood",
      artist_ids: ["d0b9f3cc-13fb-42b6-bc43-b034728e5c7b"],
      illustration_id: "b96b45bc-5bc9-4578-8789-4833d820a6b7",
      border_color: "black",
      frame: "2015",
      full_art: false,
      textless: false,
      booster: true,
      story_spotlight: false,
      edhrec_rank: 2615,
      prices: {
        usd: "4.48",
        usd_foil: "30.20",
        eur: "2.06",
        tix: "0.36",
      },
      related_uris: {
        gatherer:
          "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=442203",
        tcgplayer_decks:
          "https://decks.tcgplayer.com/magic/deck/search?contains=Prossh%2C+Skyraider+of+Kher&page=1&partner=Scryfall&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
        edhrec: "https://edhrec.com/route/?cc=Prossh%2C+Skyraider+of+Kher",
        mtgtop8:
          "https://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Prossh%2C+Skyraider+of+Kher",
      },
      purchase_uris: {
        tcgplayer:
          "https://shop.tcgplayer.com/product/productsearch?id=161428&partner=Scryfall&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
        cardmarket:
          "https://www.cardmarket.com/en/Magic/Products/Singles/Masters-25/Prossh-Skyraider-of-Kher?referrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
        cardhoarder:
          "https://www.cardhoarder.com/cards/67342?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall",
      },
    },
    {
      object: "card",
      id: "e6d5e182-1c99-475e-9468-5ed2fb4bfd71",
      oracle_id: "868882d2-ed4e-4171-a17c-478a341080fb",
      multiverse_ids: [],
      tcgplayer_id: 80125,
      name: "Prossh, Skyraider of Kher",
      lang: "en",
      released_at: "2013-11-01",
      uri: "https://api.scryfall.com/cards/e6d5e182-1c99-475e-9468-5ed2fb4bfd71",
      scryfall_uri:
        "https://scryfall.com/card/oc13/204/prossh-skyraider-of-kher?utm_source=api",
      layout: "normal",
      highres_image: true,
      image_uris: {
        small:
          "https://c1.scryfall.com/cards/small/front/e/6/e6d5e182-1c99-475e-9468-5ed2fb4bfd71.jpg?1561813402",
        normal:
          "https://c1.scryfall.com/cards/normal/front/e/6/e6d5e182-1c99-475e-9468-5ed2fb4bfd71.jpg?1561813402",
        large:
          "https://c1.scryfall.com/cards/large/front/e/6/e6d5e182-1c99-475e-9468-5ed2fb4bfd71.jpg?1561813402",
        png: "https://c1.scryfall.com/cards/png/front/e/6/e6d5e182-1c99-475e-9468-5ed2fb4bfd71.png?1561813402",
        art_crop:
          "https://c1.scryfall.com/cards/art_crop/front/e/6/e6d5e182-1c99-475e-9468-5ed2fb4bfd71.jpg?1561813402",
        border_crop:
          "https://c1.scryfall.com/cards/border_crop/front/e/6/e6d5e182-1c99-475e-9468-5ed2fb4bfd71.jpg?1561813402",
      },
      mana_cost: "{3}{B}{R}{G}",
      cmc: 6.0,
      type_line: "Legendary Creature — Dragon",
      oracle_text:
        "When you cast this spell, create X 0/1 red Kobold creature tokens named Kobolds of Kher Keep, where X is the amount of mana spent to cast Prossh.\nFlying\nSacrifice another creature: Prossh, Skyraider of Kher gets +1/+0 until end of turn.",
      power: "5",
      toughness: "5",
      colors: ["B", "G", "R"],
      color_identity: ["B", "G", "R"],
      legalities: {
        standard: "not_legal",
        future: "not_legal",
        historic: "not_legal",
        pioneer: "not_legal",
        modern: "not_legal",
        legacy: "legal",
        pauper: "not_legal",
        vintage: "legal",
        penny: "not_legal",
        commander: "legal",
        brawl: "not_legal",
        duel: "legal",
        oldschool: "not_legal",
      },
      games: [],
      reserved: false,
      foil: true,
      nonfoil: false,
      oversized: true,
      promo: false,
      reprint: true,
      variation: false,
      set: "oc13",
      set_name: "Commander 2013 Oversized",
      set_type: "memorabilia",
      set_uri:
        "https://api.scryfall.com/sets/03542833-6773-414f-992d-be88b65238af",
      set_search_uri:
        "https://api.scryfall.com/cards/search?order=set&q=e%3Aoc13&unique=prints",
      scryfall_set_uri: "https://scryfall.com/sets/oc13?utm_source=api",
      rulings_uri:
        "https://api.scryfall.com/cards/e6d5e182-1c99-475e-9468-5ed2fb4bfd71/rulings",
      prints_search_uri:
        "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A868882d2-ed4e-4171-a17c-478a341080fb&unique=prints",
      collector_number: "204",
      digital: false,
      rarity: "mythic",
      card_back_id: "597b79b3-7d77-4261-871a-60dd17403388",
      artist: "Todd Lockwood",
      artist_ids: ["d0b9f3cc-13fb-42b6-bc43-b034728e5c7b"],
      illustration_id: "b96b45bc-5bc9-4578-8789-4833d820a6b7",
      border_color: "black",
      frame: "2003",
      full_art: false,
      textless: false,
      booster: false,
      story_spotlight: false,
      edhrec_rank: 2615,
      prices: {
        usd: null,
        usd_foil: "0.76",
        eur: null,
        tix: null,
      },
      related_uris: {
        tcgplayer_decks:
          "https://decks.tcgplayer.com/magic/deck/search?contains=Prossh%2C+Skyraider+of+Kher&page=1&partner=Scryfall&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
        edhrec: "https://edhrec.com/route/?cc=Prossh%2C+Skyraider+of+Kher",
        mtgtop8:
          "https://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Prossh%2C+Skyraider+of+Kher",
      },
      purchase_uris: {
        tcgplayer:
          "https://shop.tcgplayer.com/product/productsearch?id=80125&partner=Scryfall&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
        cardmarket:
          "https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=Prossh%2C+Skyraider+of+Kher&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
        cardhoarder:
          "https://www.cardhoarder.com/cards?affiliate_id=scryfall&data%5Bsearch%5D=Prossh%2C+Skyraider+of+Kher&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall",
      },
    },
    {
      object: "card",
      id: "fc411c52-3ee2-4fe4-983d-3fa43b516237",
      oracle_id: "868882d2-ed4e-4171-a17c-478a341080fb",
      multiverse_ids: [376461],
      mtgo_id: 51370,
      mtgo_foil_id: 51371,
      tcgplayer_id: 71522,
      name: "Prossh, Skyraider of Kher",
      lang: "en",
      released_at: "2013-11-01",
      uri: "https://api.scryfall.com/cards/fc411c52-3ee2-4fe4-983d-3fa43b516237",
      scryfall_uri:
        "https://scryfall.com/card/c13/204/prossh-skyraider-of-kher?utm_source=api",
      layout: "normal",
      highres_image: true,
      image_uris: {
        small:
          "https://c1.scryfall.com/cards/small/front/f/c/fc411c52-3ee2-4fe4-983d-3fa43b516237.jpg?1562948423",
        normal:
          "https://c1.scryfall.com/cards/normal/front/f/c/fc411c52-3ee2-4fe4-983d-3fa43b516237.jpg?1562948423",
        large:
          "https://c1.scryfall.com/cards/large/front/f/c/fc411c52-3ee2-4fe4-983d-3fa43b516237.jpg?1562948423",
        png: "https://c1.scryfall.com/cards/png/front/f/c/fc411c52-3ee2-4fe4-983d-3fa43b516237.png?1562948423",
        art_crop:
          "https://c1.scryfall.com/cards/art_crop/front/f/c/fc411c52-3ee2-4fe4-983d-3fa43b516237.jpg?1562948423",
        border_crop:
          "https://c1.scryfall.com/cards/border_crop/front/f/c/fc411c52-3ee2-4fe4-983d-3fa43b516237.jpg?1562948423",
      },
      mana_cost: "{3}{B}{R}{G}",
      cmc: 6.0,
      type_line: "Legendary Creature — Dragon",
      oracle_text:
        "When you cast this spell, create X 0/1 red Kobold creature tokens named Kobolds of Kher Keep, where X is the amount of mana spent to cast Prossh.\nFlying\nSacrifice another creature: Prossh, Skyraider of Kher gets +1/+0 until end of turn.",
      power: "5",
      toughness: "5",
      colors: ["B", "G", "R"],
      color_identity: ["B", "G", "R"],
      legalities: {
        standard: "not_legal",
        future: "not_legal",
        historic: "not_legal",
        pioneer: "not_legal",
        modern: "not_legal",
        legacy: "legal",
        pauper: "not_legal",
        vintage: "legal",
        penny: "not_legal",
        commander: "legal",
        brawl: "not_legal",
        duel: "legal",
        oldschool: "not_legal",
      },
      games: ["paper", "mtgo"],
      reserved: false,
      foil: false,
      nonfoil: true,
      oversized: false,
      promo: false,
      reprint: false,
      variation: false,
      set: "c13",
      set_name: "Commander 2013",
      set_type: "commander",
      set_uri:
        "https://api.scryfall.com/sets/c62e6d4f-af8c-4f27-9bc8-361291890146",
      set_search_uri:
        "https://api.scryfall.com/cards/search?order=set&q=e%3Ac13&unique=prints",
      scryfall_set_uri: "https://scryfall.com/sets/c13?utm_source=api",
      rulings_uri:
        "https://api.scryfall.com/cards/fc411c52-3ee2-4fe4-983d-3fa43b516237/rulings",
      prints_search_uri:
        "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A868882d2-ed4e-4171-a17c-478a341080fb&unique=prints",
      collector_number: "204",
      digital: false,
      rarity: "mythic",
      card_back_id: "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
      artist: "Todd Lockwood",
      artist_ids: ["d0b9f3cc-13fb-42b6-bc43-b034728e5c7b"],
      illustration_id: "b96b45bc-5bc9-4578-8789-4833d820a6b7",
      border_color: "black",
      frame: "2003",
      full_art: false,
      textless: false,
      booster: false,
      story_spotlight: false,
      edhrec_rank: 2615,
      prices: {
        usd: "3.87",
        usd_foil: null,
        eur: "1.73",
        tix: "0.50",
      },
      related_uris: {
        gatherer:
          "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=376461",
        tcgplayer_decks:
          "https://decks.tcgplayer.com/magic/deck/search?contains=Prossh%2C+Skyraider+of+Kher&page=1&partner=Scryfall&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
        edhrec: "https://edhrec.com/route/?cc=Prossh%2C+Skyraider+of+Kher",
        mtgtop8:
          "https://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Prossh%2C+Skyraider+of+Kher",
      },
      purchase_uris: {
        tcgplayer:
          "https://shop.tcgplayer.com/product/productsearch?id=71522&partner=Scryfall&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall",
        cardmarket:
          "https://www.cardmarket.com/en/Magic/Products/Singles/Commander-2013/Prossh-Skyraider-of-Kher-V-1?referrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
        cardhoarder:
          "https://www.cardhoarder.com/cards/51370?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall",
      },
    },
  ],
};
