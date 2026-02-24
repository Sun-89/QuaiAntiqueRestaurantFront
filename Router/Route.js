export default class Route {
    constructor(url, title, pathHtml,authorize, pathJS = "") {
      this.url = url;
      this.title = title;
      this.pathHtml = pathHtml;
      this.pathJS = pathJS;
      this.authorize = authorize;
    }
}

/*
[] ->Tout le monde peut y accerder
[disconnected] -> Reserver aux utilisateurs déconnectés
["Client"] -> Reserver aux utilisateurs avec le role client
["Admin"] -> Reserver aux utilisateurs avec le role Admin
["Admin","client"] -> Reserver aux utilisateurs avec le role Admin ou client

*/