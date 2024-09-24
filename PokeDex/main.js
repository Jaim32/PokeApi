let offset = 0;  // Inicio en el primer Pokémon
const limit = 150;  // Vamos a cargar 150 Pokémon a la vez

document.addEventListener('DOMContentLoaded', () => {
  loadPokemons(); // Cargar los primeros 150 Pokémon al inicio

  const loadMoreButton = document.getElementById('load-more');
  loadMoreButton.addEventListener('click', () => {
    offset += limit;  // Incrementar el offset para cargar los siguientes 150
    loadPokemons();   // Cargar los Pokémon adicionales
  });
});

document.getElementById('pokemon-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const pokemonNameOrId = document.getElementById('pokemon-search').value.toLowerCase().trim();
  if (pokemonNameOrId) {
    clearPokemonList();  // Limpiar la lista de Pokémon
    fetchPokemon(pokemonNameOrId);  // Buscar y mostrar solo el Pokémon buscado
    document.getElementById('load-more').classList.add('hidden');  // Ocultar botón de cargar más durante la búsqueda
  }
});

// Función para cargar los Pokémon según el offset
function loadPokemons() {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const pokemons = data.results;

      // Llamamos a la API de cada Pokémon individualmente para obtener su información completa
      const pokemonPromises = pokemons.map(pokemon => fetch(pokemon.url).then(res => res.json()));

      // Cuando todas las promesas estén resueltas, mostramos los Pokémon
      Promise.all(pokemonPromises)
        .then(pokemonData => {
          pokemonData.sort((a, b) => a.id - b.id);  // Asegurar que están ordenados por número de Pokédex
          pokemonData.forEach(pokemon => displayPokemonInList(pokemon));

          // Mostrar el botón "Cargar más Pokémon" si aún quedan más Pokémon por cargar
          if (offset + limit < 1010) {  // PokeAPI tiene 1010 Pokémon disponibles
            document.getElementById('load-more').classList.remove('hidden');
          } else {
            document.getElementById('load-more').classList.add('hidden');  // Ocultar si no hay más que cargar
          }
        });
    });
}

// Función para mostrar un Pokémon en la lista principal
function displayPokemonInList(pokemon) {
  const pokemonList = document.getElementById('pokemon-list');
  
  const card = document.createElement('div');
  card.classList.add('pokemon-item-card');
  
  const image = document.createElement('img');
  image.src = pokemon.sprites.front_default;
  
  const name = document.createElement('h2');
  name.textContent = capitalizeFirstLetter(pokemon.name);

  const id = document.createElement('p');
  id.textContent = `#${pokemon.id}`;

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(id);

  card.style.backgroundColor = getPokemonTypeColor(pokemon.types[0].type.name);

  pokemonList.appendChild(card);
}

// Función para buscar un Pokémon por nombre o número
function fetchPokemon(nameOrId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Pokémon no encontrado');
      }
      return response.json();
    })
    .then(pokemon => {
      displayPokemon(pokemon);  // Mostrar el Pokémon encontrado
    })
    .catch(error => {
      alert(error.message);  // Mostrar error si el Pokémon no es encontrado
    });
}

// Función para mostrar solo el Pokémon buscado en una tarjeta
// Función para mostrar solo el Pokémon buscado en una tarjeta
function displayPokemon(pokemon) {
    const pokemonCard = document.getElementById('pokemon-card');
    const pokemonImg = document.getElementById('pokemon-img');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonId = document.getElementById('pokemon-id');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonStats = document.getElementById('pokemon-stats');
  
    // Actualiza la imagen del Pokémon
    pokemonImg.src = pokemon.sprites.front_default;
  
    // Actualiza la información del Pokémon
    pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
    pokemonId.textContent = pokemon.id;
  
    // Obtiene y muestra los tipos del Pokémon
    const types = pokemon.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name));
    pokemonTypes.textContent = types.join(', ');
  
    // Limpia y muestra las estadísticas del Pokémon
    pokemonStats.innerHTML = '';
    pokemon.stats.forEach(stat => {
      const li = document.createElement('li');
      li.textContent = `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`;
      pokemonStats.appendChild(li);
    });
  
    // Aplica el color del tipo principal del Pokémon a la card
    const mainType = pokemon.types[0].type.name;
    pokemonCard.style.backgroundColor = getPokemonTypeColor(mainType);
  
    // Muestra la card
    pokemonCard.classList.remove('hidden');
  }
  

// Función para capitalizar la primera letra de una palabra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para obtener el color según el tipo de Pokémon
function getPokemonTypeColor(type) {
  const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878',
  };
  return typeColors[type] || '#A8A878'; // Color default para 'normal'
}

// Función para limpiar la lista de Pokémon
function clearPokemonList() {
  const pokemonList = document.getElementById('pokemon-list');
  pokemonList.innerHTML = '';  // Eliminar todo el contenido de la lista
}
