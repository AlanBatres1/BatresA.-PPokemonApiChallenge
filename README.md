Name : Alan Batres
Assignment : Pokemon API Challenge
Date : 1/31/2025
Objective :
Create a single page pokemon application using the Pokemonapi

Requirements:

    using the Pokemon API https://pokeapi.co/
    Ability to search by name and Pokedex Number
        only Gen 1 - 5 pokemon
        Ability to search by name and Pokedex Number
        Ability to get a random pokemon
        image of pokemon and shiny form
        Pokemon Name
        show 1 location from any game. If pokemon doesn't have a location, have it return "N/A"
        Element Typing
        All possible abilities
        All possible moves
        Show Evolutionary Paths, if pokemon doesn't have an evolutionary path, have it return "N/A"
        And a Favorites list utilizing local storage
    Fully Responsive using Tailwind CSS https://tailwindcss.com
    Have a Prototype in Figma (Desktop, Tablet, Mobile)

 ### Peer Reviewer:Aaron Robinson
 ## Comments: Peer Review: Aaron Robinson
The site works as intended, one thing that stuck out to me is that pokemon with more than one word in its name like porygon z do not fetch properly, this is because the api puts blank spaces as - (porygon-z). I had the same problem, this can be resolved with running a funtion for each fetch input that takes in a pokemon name


function formatForSearch(input) {
    let transformedString = input.trim().replace(/ /g, '-');
    transformedString = transformedString.toLowerCase();
    return transformedString;
}

That function should take in a name and replace all spaces in between words with - 
 then the fetch:

 let findPokemonPic = async (name,pic) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formatForSearch(name)}`)
    const data = await response.json()
 }

 something like this, jocob asked me about pokemon with more than one word so theyre looking for it. I really like how certain elements change color based on type and the flowbite elements you used,looks prefessional great job
