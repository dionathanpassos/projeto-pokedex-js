const menuType = document.querySelector('.menu-type')
const selectType = document.querySelector('.select-type')
const idSelect = document.getElementById('select-type')
const inputSubmit = document.querySelector(".input-submit")
const inputText = document.querySelector(".input-search")
const optionType = document.querySelector(".option-type")
const pokeCards = document.querySelector('.poke-cards')
const result = document.querySelector(".result")
const spanError = document.querySelector(".msg-error")
const seeMore = document.querySelector(".see-more")


const colors = {
    normal: "#a4acaf",
    fighting: "#f66d6d",
    flying: "#3dc7ef",
    poison: "#b97fc9",
    ground: "#ce8056",
    rock: "#a38c21",
    bug: "#9bba48",
    ghost: "#7b62a3",
    steel: "#6594a1",
    fire: "#fd7d24",
    water: "#4592c4",
    grass: "#73b861",
    electric: "#eed535",
    psychic: "#f366b9",
    ice: "#51c4e7",
    dragon: "#2c6ac1",
    dark: "#918e8e",
    fairy: "#fdb9e9"

}

/**Função responsável por realizar o fetch na API para buscar os tipos de Pokemons e inserir em uma lista <li> */
function fetchType() {
    fetch("https://pokeapi.co/api/v2/type/")
        .then(resp => resp.json())
        .then(function (data) {
            const resp = data.results;

            for (let i = 0; i < 18; i++) {
                const option = document.createElement('option')
                option.innerHTML = resp[i].name
                option.value = resp[i].url
                option.classList = "option-type"
                selectType.appendChild(option)

                const li = document.createElement('li')
                const link = document.createElement('a')
                link.innerHTML = resp[i].name
                link.setAttribute("href", resp[i].url)
                link.classList = "link-type"

                menuType.appendChild(li)
                li.appendChild(link)


            }
        })
}
fetchType()
/**Fim fetch API Type */

seeMore.addEventListener('click', ev => {

    pokeCards.style.height = pokeCards.clientHeight + 734 + "px"
})

/*Código responsável por monitorar os links <a> e capturar o href*/
menuType.addEventListener('click', ev => {
    ev.preventDefault();    
    removeCards()
    pokeCards.style.height = 734 + "px"
    seeMore.style.visibility = "visible"
    spanError.style.display = "none"

    let menuLink = ev.target.closest('a')
    
    if (menuLink.text === "Todos") {
            fetchAllPokemon()   
    } else {
        fethUrlType(menuLink.href)
    }
});
/*Fim EventListener*/

function getUrlSelect() {
    const url = selectType.options[selectType.selectedIndex].value
    const text = selectType.options[selectType.selectedIndex].text
    if (text === "Todos") {
        fetchAllPokemon()
    } else {
        fethUrlType(url)
    }
    removeCards()
    spanError.style.display = "none"
    pokeCards.style.height = 734 + "px"
    seeMore.style.visibility = "visible"

}
/**Codigo responsável por monitorar o input do form e capturar o que foi digitado pelo usuário */
inputSubmit.addEventListener("click", ev => {
    ev.preventDefault();
    let id = inputText.value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    fetchSinglePokemom(url);
    spanError.style.display = "none"
    result.innerHTML = ""
    inputText.value = ""
    removeCards()
    pokeCards.style.height = "auto"
    seeMore.style.visibility = "hidden"
})
/**Fim EventListener */

/*Fecth Single Pokemon*/
function fetchSinglePokemom(url) {

    fetch(url)
        .then(resp => resp.json())
        .then(function (data) {
            createPokeCard(data);

            result.innerHTML = `Pokémon ${data.name.toUpperCase()} encontrado!`
        }).catch(error => {
            result.innerHTML = ":("
            spanError.style.display = "block"
        })
}
/*Fim Fecth Single Pokemon*/

/*Create Single card Pokemon */
function createPokeCard(data) {
    let img = data.sprites.other.dream_world.front_default;
    
    if(img === null) {
        img = data.sprites.front_default;
    }
    if(img ===null){
        img = "/img/error-404.svg"
    }

    pokeCards.innerHTML = `
    <div class="poke-card">
                    <div class="poke-content">
                        <p class="id">#${data.id}</p>
                        <div class="card-img">
                            <img class="img" src="${img}"
                            alt="${data.name}">
                        </div>
                        <h3 class="poke-name">${data.name}</h3>
                        <div class="types"> 
                        </div>
                        <div class="stats">
                            <div>
                                <h3>${data.stats[1].base_stat}</h3>
                                <p>Attack</p>
                            </div>
                            <div>
                            <h3>${data.stats[2].base_stat}</h3>
                                <p>Defense</p>
                            </div>
                            <div>
                            <h3>${data.stats[5].base_stat}</h3>
                                <p>Speed</p>
                            </div>
                        </div>
                    </div>
                </div>
    `;
    const pokeCard = document.querySelector('.poke-card');
    const primaryType = colors[data.types[0].type.name];
    pokeCard.style.background = `radial-gradient(circle at 50% 0%, ${primaryType} 36%, #fff 36%)`;

    let appendType = (types) => {
        types.forEach((item) => {
            const pokeType = document.querySelector(".types");
            const span = document.createElement('span');
            span.textContent = item.type.name;
            span.style.background = colors[item.type.name]
            pokeType.appendChild(span);
        })
    }
    appendType(data.types);
}
/*FimCreate Single card Pokemon */

/*Fetch em todos os Pokemon da API */
function fetchAllPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1&offset=0")
        .then(resp => resp.json())
        .then(function (data) {
            const resp = data.results;
            result.textContent = data.results.length + ' Pokémons encontrados';
            resp.map((resp) => {
                fetchUrlPokemon(resp.url);
            })

        })
}
fetchAllPokemon()

function fetchUrlPokemon(url) {
    fetch(url)
        .then(resp => resp.json())
        .then(function (url) {
            
            createPokemon(url);
        })
}

function createPokemon(data) {
    const id = "#" + data.id;
    let img = data.sprites.other.dream_world.front_default;

    if(img === null) {
        img = data.sprites.front_default;
    }
    if(img ===null){
        img = "/img/error-404.svg"
    }

    const pokeCard = document.createElement('div');
    pokeCard.className = "poke-card";
    const pokeContent = document.createElement('div');
    pokeContent.className = "poke-content";
    const pokeId = document.createElement('span');
    pokeId.className = "id";
    pokeId.textContent = id;
    const divCardImg = document.createElement('div');
    divCardImg.className = "card-img";
    const imgPokemon = document.createElement('img');    
    imgPokemon.src = img
    imgPokemon.alt = data.name
    const h3PokeName = document.createElement('h3');
    h3PokeName.className = "poke-name";
    h3PokeName.textContent = data.name;
    const pokeType = document.createElement('div');
    pokeType.className = "types";

    let appendTypes = (types) => {
        types.forEach((item) => {
            const span = document.createElement('span');
            span.textContent = item.type.name;
            span.style.background = colors[item.type.name]
            pokeType.appendChild(span);
        })
    }
    appendTypes(data.types);

    const pokeStats = document.createElement('div');
    pokeStats.className = "stats";

    pokeStats.innerHTML = (`
        <div>
            <h3>${data.stats[1].base_stat}</h3>
            <p>Attack</p>
        </div>
        <div>
            <h3>${data.stats[2].base_stat}</h3>
            <p>Defense</p>
        </div>
        <div>
            <h3>${data.stats[5].base_stat}</h3>
            <p>Speed</p>
        </div>
    
    `);


    const primaryType = colors[data.types[0].type.name];
    pokeCard.style.background = `radial-gradient(circle at 50% 0%, ${primaryType} 36%, #fff 36%)`;

    pokeCards.appendChild(pokeCard);
    pokeCard.appendChild(pokeContent);
    pokeContent.appendChild(pokeId);
    pokeContent.appendChild(divCardImg);
    divCardImg.appendChild(imgPokemon);
    pokeContent.appendChild(h3PokeName);
    pokeContent.appendChild(pokeType);
    pokeContent.appendChild(pokeStats);



}
/*Fim Fetch em todos os Pokemon da API */

/*Fetch na URl Capturada dos Links */

function fethUrlType(urlType) {

    fetch(urlType)
        .then(resp => resp.json())
        .then(function (data) {
            const results = data.pokemon
            result.textContent = results.length + ' Pokémons encontrado';
            results.map((result) => {
                fetchUrlPokemon(result.pokemon.url)
                
            })
        })
}
/*FimFetch na URl Capturada dos Links */















function paginate() {
    const pokeCard = document.querySelectorAll(".poke-card")


    for (let i = 0; i < 6; i++) {

    }


}
paginate()


function removeCards() {
    const card = document.querySelectorAll('.poke-card');

    for (let i = 0; i < card.length; i++) {
        card[i].remove();

    }
}
