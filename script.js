let offset = 0; 
const pokeApi = (offset) => `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=15`;
const pokemonArray = [];
const filteredPokemonArray = [];
let currentPokemonIndex = 0;
const overlayCardArray = {
  fire: "/assets/card/fire.png",
  water: "/assets/card/water.png",
  grass: "/assets/card/grass.png",
  electric: "/assets/card/electric.png",
  dark: "/assets/card/dark.png",
  fighting: "/assets/card/dark.png",
  psychic: "/assets/card/psychic.png",
  steel: "/assets/card/steel.png",
  stellar: "/assets/card/stellar.png",
  rock: "/assets/card/steel.png",
  poison: "/assets/card/psychic.png",
  normal: "/assets/card/stellar.png",
  ice: "/assets/card/water.png",
  ground: "/assets/card/dark.png",
  ghost: "/assets/card/psychic.png",
  flying: "/assets/card/stellar.png",
  fairy: "/assets/card/psychic.png",
  dragon: "/assets/card/stellar.png",
  bug: "/assets/card/grass.png",
};

const backgroundPictureArray = {
  fire: "/assets/cart-img/fire.jpeg",
  water: "/assets/cart-img/water.jpeg",
  grass: "/assets/cart-img/plant.jpeg",
  electric: "/assets/cart-img/electric.jpeg",
  dark: "/assets/cart-img/dark.jpeg",
  fighting: "/assets/cart-img/fighting.jpeg",
  psychic: "/assets/cart-img/psychic.jpeg",
  steel: "/assets/cart-img/steel.jpeg",
  stellar: "/assets/cart-img/stellar.jpeg",
  rock: "/assets/cart-img/rock.jpeg",
  poison: "/assets/cart-img/poison.jpeg",
  normal: "/assets/cart-img/normal.jpeg",
  ice: "/assets/cart-img/ice.jpeg",
  ground: "/assets/cart-img/ground.jpeg",
  ghost: "/assets/cart-img/ghost.jpeg",
  flying: "/assets/cart-img/flying.jpeg",
  fairy: "/assets/cart-img/fairy.jpeg",
  dragon: "/assets/cart-img/dragon.jpeg",
  bug: "/assets/cart-img/bug.jpeg",
};

function init() {
  loadPokemons(); 
  addLoadMoreButton(); 
}




async function loadPokemons() {
  try {
    let response = await fetch(pokeApi(offset));
    let responseAsJson = await response.json();

    for (let pokemon of responseAsJson.results) {
      let pokemonDetails = await fetch(pokemon.url);
      let pokemonDetailsJson = await pokemonDetails.json();
      pokemonArray.push(pokemonDetailsJson);
    }
    renderContent();
    offset += 15; 
  } catch (error) {
    console.error("loadPokemons Fetch error", error);
  }
}



function searchPokemons() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  
  
  filteredPokemonArray.length = 0; 
  for (const pokemon of pokemonArray) {
    if (pokemon.name.toLowerCase().includes(searchTerm)) {
      filteredPokemonArray.push(pokemon);
    }
  }
  renderContent(filteredPokemonArray); 
}



function addLoadMoreButton() {
  const loadMoreDiv = document.getElementById('load-more');
  loadMoreDiv.onclick = loadPokemons; 
}

async function getAbility(abilityUrl) {
  try {
    let response = await fetch(abilityUrl);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ability data: ${error}`);
  }
}

async function renderOverlay(i) {
  currentPokemonIndex = i; 
  let overlayRef = document.getElementById("overlay");
  overlayRef.innerHTML = "";

  let element = pokemonArray[i];
  let pokeCard = renderOverlayCard(element);
  let bg = renderBackgroundPicture(element);

  overlayRef.style.display = "flex";

  let abilityData = await getAbility(element.abilities[0].ability.url);
  let abilityDescription = abilityData.effect_entries.find(entry => entry.language.name === 'en').effect;

  overlayRef.innerHTML += /*html*/ `
    <div class="poke-card-div">
      <img class="poke-card-background-img" src="${bg}" alt="">
      <img class="poke-card" src="${pokeCard}" alt="">
      <img class="poke-card-pokemon-img" src="${element.sprites.other["official-artwork"].front_default}">
      <div class="poke-card-name"> ${element.name}</div>
      <div class="poke-card-hp">
        <div class="hp-nr">${element.stats[0].base_stat}</div>
        <div class="hp">${element.stats[0].stat.name}</div>
      </div>

      <div class="pokemon-id">NR. 00 ${element.id}</div>
      <div class="pokemon-height">Height: ${element.height}</div>
      <div class="pokemon-weight">Weight: ${element.weight}</div>

        <div class="attak-name">${element.abilities[0].ability.name}</div>
        <div class="atk-nr">${element.stats[1].base_stat}</div>
        <div class="attak-description">${abilityDescription}</div>
      
    </div>
    

    <svg class="left-arrow" onclick="navigatePokemon(-1)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.6621 17C18.933 19.989 15.7013 22 11.9999 22C6.47703 22 1.99988 17.5228 1.99988 12C1.99988 6.47715 6.47703 2 11.9999 2C15.7013 2 18.933 4.01099 20.6621 7M11.9999 8L7.99995 12M7.99995 12L11.9999 16M7.99995 12H21.9999" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    
    <svg class="right-arrow" onclick="navigatePokemon(1)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M3.33789 7C5.06694 4.01099 8.29866 2 12.0001 2C17.5229 2 22.0001 6.47715 22.0001 12C22.0001 17.5228 17.5229 22 12.0001 22C8.29866 22 5.06694 19.989 3.33789 17M12 16L16 12M16 12L12 8M16 12H2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>

  `;

overlayRef.onclick = function(event) {
  if (event.target === overlayRef) {
    overlayRef.style.display = "none"; 
  }
};
}


// async function renderEvoOverlay(i) {
//   let overlayRef = document.getElementById("evo-overlay");
//   overlayRef.innerHTML = "";

//   overlayRef.style.display = "flex";

//   overlayRef.innerHTML += /*html*/ `
//     <div class "overlay-content">

//     </div>
//   `;

// overlayRef.onclick = function() {
//   overlayRef.style.display = "none"; // Close the overlay
// };
// }



function navigatePokemon(direction) {
  currentPokemonIndex += direction; 
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = 0; 
  } else if (currentPokemonIndex >= pokemonArray.length) {
    currentPokemonIndex = pokemonArray.length - 1; 
  }
  renderOverlay(currentPokemonIndex); 
}

function renderBackgroundPicture(element) {
  let pokeType = element.types[0].type.name;
  return backgroundPictureArray[pokeType];
}

function renderOverlayCard(element) {
  let pokeType = element.types[0].type.name;
  return overlayCardArray[pokeType];
}

function renderContent(filteredArray = pokemonArray) {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";

  const arrayToRender = filteredArray.length > 0 ? filteredArray : pokemonArray;

  for (let i = 0; i < arrayToRender.length; i++) {
    const element = arrayToRender[i];
    let bg = renderBackgroundPicture(element);
    let types = element.types.map((typeInfo) => typeInfo.type.name).join(" ");

    contentRef.innerHTML += /*html*/ `
      <div onclick="renderOverlay(${i})" class="pokemon-card-img" style="background-image: url(${bg})">
        <div class="pokemon-name"> ${element.name}</div>
        <div class="pokemon-id-2">00${element.id}</div>
        <div class="pokemon-img-div"> 
          <img class="pokemon-img" src="${element.sprites.other.showdown.front_default}">
        </div>
        <div class="pokemon-types"> ${types}</div>
      </div>
    `;
  }
}


// loading screen -
//      - enton with fragezeichen(drehend)
