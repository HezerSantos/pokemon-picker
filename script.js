//name
// sprites[front_default]
//types[type][name]

/*
<div class="pokemon">
    <button class="deleteButton">X</button>
    <h3 class="pokeName">Chimchar</h3>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png" alt=""> 
    <span>Types: lorem ipsum</span>
</div>
*/

//creates each part of the card
const createContainer = (classname) => {
    const div = document.createElement("div");
    div.classList.add(classname);
    return div;
}

const createDeleteButton = (classname) => {
    const button = document.createElement("button");
    button.textContent = 'X';
    button.classList.add(classname);
    return button;
}

const createPokeName = (classname, content) => {
    const h3 = document.createElement("h3");
    h3.textContent = content;
    h3.classList.add(classname);
    return h3;
}

const createPokeImg = (url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = 'pokemon image';
    return img;
}

//got lazy creating variable names
const createTypes = (classname, types) => {
    const span = document.createElement("span");
    span.textContent = 'Types: ';
    types.forEach(type => {
        const span2 = document.createElement("span");
        span2.textContent = `${type}`;
        span2.classList.add(type);
        span.appendChild(span2);
    })
    span.classList.add(classname);
    return span;
}


const pokemonObject = (name, img) => {
    const types = [];
    return {name, img, types};
}

//gets error html
const errorMessage = document.querySelector(".errorMessage");
const errorContainer = document.querySelector(".errorContainer");
const closeButton = document.querySelector(".closeContainer");
const errorText = document.querySelector(".errorText");

//close button method
const closeGeneralContainer = () => {
    closeButton.addEventListener('click', () => {
        errorMessage.classList.add("hide");
        errorText.textContent = '';
    })
}

//calls it
closeGeneralContainer();

//shows the error container with error/ full status
const showError = (status) => {
    let digit = /^\d+$/.test(status);
     
    if (digit){
        if (status === 404){
            errorText.textContent = `Error Code: ${status} Pokemon Not Found`;
        } else {
            errorText.textContent = `Error Code: ${status}`;
        }
    } else {
        errorText.textContent = `Your Team is Full!`;
    };

    errorMessage.classList.remove('hide');
};

//uses pokeapi and returns an object if successful
const getPokemon = async(name) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (response.status !== 200){
        showError(response.status);
        return false
    }
    const data = await response.json();
        
    const newPokeon = pokemonObject(data['name'], data['sprites']['front_default']);
    data['types'].forEach(type => {
        newPokeon.types.push(type['type']['name']);
    });
    return newPokeon;      
}

//gets each card
const cardOne = document.querySelector("#cardOne");
const cardTwo = document.querySelector("#cardTwo");
const cardThree = document.querySelector("#cardThree");
const cardFour = document.querySelector("#cardFour");
const cardFive = document.querySelector("#cardFive");
const cardSix = document.querySelector("#cardSix");

//list of cards
const cardList = [cardOne, cardTwo, cardThree, cardFour, cardFive, cardSix];

//matrix to track cards
const cardTracker = [0,0,0,0,0,0];

//creates an empty card to replace when card is deleted
const createEmptyCard = () => {
    const div = createContainer('empty');
    div.classList.add('pokemon');
    div.textContent = 'Empty';
    return div;
}

//event listener for delet button on card
const deleteButtonFunction = (button, index) => {
    button.addEventListener('click', () => {
        const parent = button.parentNode;
        const grandparent = parent.parentNode;
        grandparent.firstChild.remove();
        cardTracker[index] = 0;
        grandparent.appendChild(createEmptyCard());
    })
}

//returns the index so that cardTracker can be updated
const returnIndex = () => {
    let index = 0
    for (let i = 0; i < cardTracker.length; i++){
        if (cardTracker[i] === 0){
            index = i;
            break
        }
    }
    
    return index;
}


//creates the pokemon html card and updates cardTracker
const createPokemon = async(name, card) => {
    try{
        const pokemon = await getPokemon(name);
        if (pokemon === false){
            return
        } else {
        const container = createContainer('pokemon');
        const delBtn = createDeleteButton('deleteButton');
        const index = returnIndex();
        deleteButtonFunction(delBtn, index);
        const pokeName = createPokeName('pokeName', pokemon.name.toUpperCase());
        const pokeImg = createPokeImg(pokemon.img);
        const types = createTypes('types', pokemon.types);

        resetPokeCard(cardList[index]);
        cardTracker[index] = 1;

        container.append(delBtn, pokeName, pokeImg, types);

        card.appendChild(container);
        };
    } catch (error){
        
    }
}

//resets the card when deleted/created
const resetPokeCard = (card) => {
    while (card.firstChild){
        card.firstChild.remove();
    };
}

//gets the search bar
const searchBar = document.querySelector(".searchBar");
const go = document.querySelector(".searchButton");

const checkFull = () => {
    const filter = cardTracker.filter(num => num !== 0);
    if (filter.length === cardTracker.length){
        return true;
    }
}

//clear button function
const clear = () => {
    cardList.forEach((card, index) => {
        cardTracker[index] = 0;
        resetPokeCard(card);
        card.appendChild(createEmptyCard());
    });
};

//search button event listener
go.addEventListener('click', async() => {
    const search = searchBar.value.toLowerCase().trim();
    searchBar.value = '';
    //cant use foreach cause it cant use break
    for (let i = 0; i < cardTracker.length; i++){
        if (cardTracker[i] === 0){
            await createPokemon(search, cardList[i]);
            break;
        }
    }
    if(checkFull() === true){
        showError('full');
    }
});

//gets clear button
const clearButton = document.querySelector("#clear");

//clear button event listener
clearButton.addEventListener('click', (clear));





