import { saveToLocalStorageByName, getLocalStorage, removeFromLocalStorage } from "./localStorage.js";

const pokemonImg = document.getElementById("pokemonImg");
const pokemonName = document.getElementById("pokemonName");
const pokemonType = document.getElementById("pokemonType");
const pokemonType2 = document.getElementById("pokemonType2");
const pokemonIndex = document.getElementById("pokemonIndex");
const pokemonCard = document.getElementById("pokemonCard");
const pokemonLocation = document.getElementById("pokemonLocation");
const ability1 = document.getElementById("ability1");
const ability2 = document.getElementById("ability2");
const moves = document.getElementById("moves");
const evolution = document.getElementById("evolution");
const defaultSearch = document.getElementById("default-search");
const favorites = document.getElementById("favorites");
const gap = document.getElementById("gap")
// Buttons
const setFavBtn = document.getElementById("setFavBtn");
const shinyBtn = document.getElementById("shinyBtn");
const favBtn = document.getElementById("favBtn");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const movesBtn = document.getElementById("movesBtn");
const evolutionBtn = document.getElementById("evolutionBtn");

let userInput = "";
let pokemon = {};

const getPokemon = async (nameId) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameId}`);
    const data = await response.json();
    console.log(data);
    return data;
};

const getEvolutionChain = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data.chain;
};

// evolution images
async function displayEvolutionChain(chain) {
    const evolutionImages = [];
    let currentChain = chain;
    while (currentChain) {
        const evolutions = await getPokemon(currentChain.species.name);
        if (evolutions) {
            evolutionImages.push(evolutions.sprites.other["official-artwork"].front_default);
        }
        // Move to next evo
        currentChain = currentChain.evolves_to[0] || null;
    }
    // Display imgs
    evolution.innerHTML = "";
    evolutionImages.forEach(imageSrc => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.classList.add("w-[130px]", "h-[130px]");
        evolution.appendChild(img);
    });
}

// function to capitalize first letter of string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateFavBtn(pokemonName) {
    const favoritesList = getLocalStorage();
    
    if (favoritesList.includes(pokemonName)) {
        setFavBtn.src = "./assets/gaming (1).png";
    } else {
        setFavBtn.src = "./assets/gaming.png";
    }
}

function createFavoriteItem(pokemonName) {
    const item = document.createElement('div');
    item.className = 'flex justify-between items-center p-2 text-[20px] text-white';
    
    //clickable name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = capitalize(pokemonName);
    nameSpan.className = 'cursor-pointer';
    nameSpan.addEventListener('click', async () => {
        defaultSearch.value = pokemonName;
        await searchBtn.click();
    });
    
    // remove btn
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'x';
    removeBtn.className = 'text-fighting font-bold text-[20px] px-2 cursor-pointer';
    
    removeBtn.addEventListener('click', () => {
        removeFromLocalStorage(pokemonName);
        item.remove();
        
        // Update favorite button
        if (pokemon.species && pokemon.species.name === pokemonName) {
            setFavBtn.src = "./assets/gaming.png";
        }
    });
    
    item.appendChild(nameSpan);
    item.appendChild(removeBtn);
    
    return item;
}

// Shiny activation
shinyBtn.addEventListener("click", () => {
    if (pokemon && pokemon.sprites) {
        if (shinyBtn.src.includes("sparkling.png")) {
            shinyBtn.src = "./assets/sparkling (1).png";
            pokemonImg.src = pokemon.sprites.other["official-artwork"].front_shiny || pokemon.sprites.other["official-artwork"].front_default;
        } else {
            shinyBtn.src = "./assets/sparkling.png";
            pokemonImg.src = pokemon.sprites.other["official-artwork"].front_default;
        }
    }
});

// Favorite button event listener
setFavBtn.addEventListener("click", () => {
    if (!pokemon.species) return; 
    const pokemonName = pokemon.species.name;

    if (setFavBtn.src.includes("gaming.png")) {
        setFavBtn.src = "./assets/gaming (1).png";
        saveToLocalStorageByName(pokemonName);
    } else {
        setFavBtn.src = "./assets/gaming.png";
        removeFromLocalStorage(pokemonName);
    }
});

favBtn.addEventListener("click", async () => {
    const favoritesList = getLocalStorage();
    favorites.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'flex flex-col p-4 ';
    
    for (const name of favoritesList) {
        const item = createFavoriteItem(name);
        container.appendChild(item);
    }
    favorites.appendChild(container);
});

defaultSearch.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchBtn.click();
        console.log("enter")
    }
});

// Search button functionality
searchBtn.addEventListener('click', async () => {
    userInput = defaultSearch.value;
    const search = userInput.trim().toLowerCase();

    pokemon = await getPokemon(search);

    if (pokemon.id < 650) {
        pokemonImg.src = pokemon.sprites.other["official-artwork"].front_default;
        pokemonName.innerText = capitalize(pokemon.species.name);
        pokemonIndex.innerText = `#${pokemon.id}`;

        const locationResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`);
        const locations = await locationResponse.json();
        pokemonLocation.innerText = locations.length > 0 ? capitalize(locations[0].location_area.name) : "N/A";

        ability1.innerText = capitalize(pokemon.abilities[0].ability.name);
        ability2.innerText = pokemon.abilities[1] ? capitalize(pokemon.abilities[1].ability.name) : "";

        const primaryType = pokemon.types[0].type.name;
        const primaryType2 = pokemon.types[1] ? pokemon.types[1].type.name : null;

        pokemonType.innerText = capitalize(primaryType);
        if (primaryType2) {
            pokemonType2.innerText = capitalize(primaryType2);
            gap.className = "flex flex-row gap-2"; 
        } else {
            pokemonType2.innerText = "";
            gap.className = "flex flex-row";
        }

        pokemonCard.className = `bg-${primaryType} w-[410px] h-[530px] border-[#4B5563] border-[11px] rounded-[15px]`;
        pokemonName.className = `text-${primaryType} text-[18px] font-[Inter] font-bold`;
        pokemonType.className = `bg-${primaryType} rounded-[14px] p-[5px] text-white font-[Inter] font-bold`;
        pokemonType2.className = primaryType2 ? `bg-${primaryType2} rounded-[14px] p-[5px] text-white font-[Inter] font-bold` : '';

        movesBtn.className = `bg-${primaryType} cursor-pointer text-white rounded-[14px] p-[5px] font-[Inter] font-bold mt-3`;
        evolutionBtn.className = `bg-${primaryType} cursor-pointer text-white rounded-[14px] p-[5px] font-[Inter] font-bold mt-3`;

        const movesList = pokemon.moves.map(move => capitalize(move.move.name)).join(", ");
        moves.innerText = `Moves: ${movesList}`;

        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionChain = await getEvolutionChain(speciesData.evolution_chain.url);

        displayEvolutionChain(evolutionChain);
        
        updateFavBtn(pokemon.species.name);
    }
    else if (pokemon.id > 650) {
        alert("Please enter a gen 5 pokemon");
        return;
    }
});

// Random button functionality
randomBtn.addEventListener('click', async () => {
    const Random = Math.floor(Math.random() * 649) + 1;
    const randomPokemon = await getPokemon(Random);
    console.log(randomPokemon);

    if (randomPokemon) {
        pokemon = randomPokemon;

        pokemonImg.src = pokemon.sprites.other["official-artwork"].front_default;
        pokemonName.innerText = capitalize(pokemon.species.name);
        pokemonIndex.innerText = `#${pokemon.id}`;

        const locationResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`);
        const locations = await locationResponse.json();
        pokemonLocation.innerText = locations.length > 0 ? capitalize(locations[0].location_area.name) : "N/A";

        ability1.innerText = capitalize(pokemon.abilities[0].ability.name);
        ability2.innerText = pokemon.abilities[1] ? capitalize(pokemon.abilities[1].ability.name) : "";

        const primaryType = pokemon.types[0].type.name;
        const primaryType2 = pokemon.types[1] ? pokemon.types[1].type.name : null;

        pokemonType.innerText = capitalize(primaryType);
        if (primaryType2) {
            pokemonType2.innerText = capitalize(primaryType2);
            gap.className = "flex flex-row gap-2";
        } else {
            pokemonType2.innerText = '';
            gap.className = "flex flex-row";
        }

        pokemonCard.className = `bg-${primaryType} w-[410px] h-[530px] border-[#4B5563] border-[11px] rounded-[15px]`;
        pokemonName.className = `text-${primaryType} text-[18px] font-[Inter] font-bold`;
        pokemonType.className = `bg-${primaryType} rounded-[14px] p-[5px] text-white font-[Inter] font-bold`;
        pokemonType2.className = primaryType2 ? `bg-${primaryType2} rounded-[14px] p-[5px] text-white font-[Inter] font-bold` : '';

        movesBtn.className = `bg-${primaryType} cursor-pointer text-white rounded-[14px] p-[5px] font-[Inter] font-bold mt-3`;
        evolutionBtn.className = `bg-${primaryType} cursor-pointer text-white rounded-[14px] p-[5px] font-[Inter] font-bold mt-3`;

        const movesList = pokemon.moves.map(move => capitalize(move.move.name)).join(", ");
        moves.innerText = `Moves: ${movesList}`;

        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionChain = await getEvolutionChain(speciesData.evolution_chain.url);

        displayEvolutionChain(evolutionChain);
        
        updateFavBtn(pokemon.species.name);
    }
});