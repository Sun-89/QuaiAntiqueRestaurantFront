import Route from "./Route.js";

export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/galerie", "La galerie", "/pages/galerie.html", [], "js/galerie.js"),
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/auth/signup.html", ["disconnected"], "js/auth/signup.js"),
    new Route("/account", "Mon compte", "/pages/auth/account.html", ["ROLE_USER", "ROLE_ADMIN"], "js/auth/account.js"),
    new Route("/editPassword", "Modifier mon mot de passe", "/pages/auth/editPassword.html", ["ROLE_USER", "ROLE_ADMIN"], "js/auth/editPassword.js"),
    new Route("/allResa", "Vos réservations", "/pages/Reservation/allResa.html", ["ROLE_USER"], "js/allResa.js"),
    new Route("/reserver", "Réserver", "/pages/Reservation/reserver.html", ["ROLE_USER"], "js/reserver.js"),
    new Route("/annulResa", "annulation", "/pages/Reservation/annulResa.html", ["ROLE_USER"], "js/annulResa.js"),
    new Route("/menu", "menu" , "/pages/menu.html", ["ROLE_ADMIN"]),
    new Route("/carte", "La carte", "/pages/carte.html", []),
]

export const websiteName = "Quai Antique";