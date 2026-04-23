
const tokenCookieName = "accesstoken";
const signoutBtn =document.getElementById("signout-btn");
const roleCookieName ="role";
const apiUrl = "http://127.0.0.1:8001/api/";

signoutBtn.addEventListener("click", signout);

function getRole(){
    return getCookie(roleCookieName);
}

function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.reload();
}

function setToken(token){
    setCookie(tokenCookieName, token, 7);
}

function getToken(){
    return getCookie(tokenCookieName);
}

function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1,c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected(){
    return getToken() != null && getToken() != undefined;
}


/*
Disconected
connected (admin ou client)
   - admin
   - client
*/

function showAndHideElementForRoles(){
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        switch(element.dataset.show){
            case 'disconnected':
                if(userConnected) element.classList.add("d-none");
                else element.classList.remove("d-none"); // Pense à remove si on se déconnecte !
                break;
            case 'connected':
                if(!userConnected) element.classList.add("d-none");
                else element.classList.remove("d-none");
                break;
            case 'admin':
                if(!userConnected || role !== "ROLE_ADMIN") element.classList.add("d-none");
                else element.classList.remove("d-none");
                break;
            case 'client':
                // Ici, on vérifie ROLE_USER car c'est ce que Symfony envoie
                if(!userConnected || (role !== "ROLE_USER" && role !== "client")) {
                    element.classList.add("d-none");
                } else {
                    element.classList.remove("d-none");
                }
                break;
        }
    })
}

function sanitizeHtml(text){
    const tempHtml = document.createElement('div');
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
}

function getInfoUser(){
    console.log("recuperation des infos utilisateur ...");

    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiUrl + "account/me", requestOptions)
        .then(response =>{
            if(response.ok){
                return response.json();
            } else {
                console.log("Erreur lors de la récupération des infos utilisateur");
            }
        })
        .then(result => {
            console.log(result);
        })
        .catch(error => console.log('erreur lors de la récupération des infos utilisateur', error))
}

// Dans ton fichier script.js (ou là où tu as ton bouton de déconnexion)
const btnSignout = document.getElementById("btn-signout"); // Assure-toi de l'ID

if(btnSignout){
    btnSignout.addEventListener("click", (e) => {
        e.preventDefault();
        
        // 1. On supprime le token et les infos
        eraseToken(); 
        
        // 2. On redirige vers l'accueil en utilisant le routeur
        const dummyEvent = { 
            preventDefault: () => {}, 
            target: { href: window.location.origin + "/" } 
        };
        route(dummyEvent); 
        
        console.log("Utilisateur déconnecté, redirection vers l'accueil.");
    });
}