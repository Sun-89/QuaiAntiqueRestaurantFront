import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html",[]);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
    const loader = document.getElementById("loader")
    
    try {
        const path = window.location.pathname;
        const actualRoute = getRouteByUrl(path);
        const allRolesArray = actualRoute.authorize;

        if(allRolesArray.length > 0){
            if(allRolesArray.includes("disconnected")){
                if(isConnected()){
                    loader.classList.add("hidden") // ✅ cacher avant redirect
                    window.location.replace("/");
                    return // ✅ stopper l'exécution
                }
            } else {
                const roleUser = getRole();
                if(!allRolesArray.includes(roleUser)){
                    loader.classList.add("hidden") // ✅ cacher avant redirect
                    window.location.replace("/");
                    return // ✅ stopper l'exécution
                }
            }
        }

        const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
        document.getElementById("main-page").innerHTML = html;

        if (actualRoute.pathJS != "") {
            let scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", actualRoute.pathJS);
            document.querySelector("body").appendChild(scriptTag);
        }

        document.title = actualRoute.title + " - " + websiteName;
        showAndHideElementForRoles();

    } catch(error) {
        console.error("Erreur de chargement :", error)
    } finally {
        loader.classList.add("hidden") // ✅ se déclenche toujours
    }
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();