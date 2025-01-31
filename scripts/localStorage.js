function saveToLocalStorageByName(name){
let favoritesList = getLocalStorage();

if(!favoritesList.includes(name)){
    favoritesList.push(name);
}

localStorage.setItem('Names', JSON.stringify(favoritesList));
}

function getLocalStorage(){
    let localStorageData = localStorage.getItem('Names')

    if(localStorageData == null){
        return[];
    }

    return JSON.parse(localStorageData);
}

function removeFromLocalStorage(name){
    let favoritesList = getLocalStorage();

    let nameindex = favoritesList.indexOf(name);

    favoritesList.splice(nameindex, 1);

    localStorage.setItem('Names', JSON.stringify(favoritesList));

}

export{saveToLocalStorageByName, getLocalStorage, removeFromLocalStorage}