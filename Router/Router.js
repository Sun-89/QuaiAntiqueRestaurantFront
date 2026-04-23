import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

const getRouteByUrl = (url) => {
    let currentRoute = null;
    allRoutes.forEach((element) => {
        if (element.url == url) currentRoute = element;
    });
    return currentRoute != null ? currentRoute : route404;
};

const LoadContentPage = async () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.remove("hidden");

    try {
        const path = window.location.pathname;
        const actualRoute = getRouteByUrl(path);
        const allRolesArray = actualRoute.authorize;

        const roleUser = getRole(); 

        if (allRolesArray.length > 0) {
            if (allRolesArray.includes("disconnected")) {
                if (isConnected()) {
                    window.location.replace("/");
                    return;
                }
            } else {
                if (!isConnected() || !allRolesArray.includes(roleUser)) {
                    window.location.replace("/");
                    return;
                }
            }
        }

        const response = await fetch(actualRoute.pathHtml);
        if (!response.ok) throw new Error("Erreur HTML");
        
        const html = await response.text();
        document.getElementById("main-page").innerHTML = html;

        if (actualRoute.pathJS !== "") {
            const oldScripts = document.querySelectorAll('script[data-dynamic]');
            oldScripts.forEach(s => s.remove());

            let scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", actualRoute.pathJS + "?v=" + Date.now());
            scriptTag.setAttribute("data-dynamic", "true");
            document.body.appendChild(scriptTag);
        }

        document.title = actualRoute.title + " - " + websiteName;
        showAndHideElementForRoles();

    } catch (error) {
        console.error("Erreur de routage :", error);
    } finally {
        if (loader) loader.classList.add("hidden");
    }
};

const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    LoadContentPage();
};

// Ces lignes doivent être accessibles à tout moment
window.onpopstate = LoadContentPage;
window.route = routeEvent;

LoadContentPage();