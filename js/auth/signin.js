{
    const signinForm = document.getElementById("signinForm");
    const btnSignin = document.getElementById("btnSignin");
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");

    // Sécurité : on vérifie si les éléments existent dans la page actuelle
    if (btnSignin && signinForm) {
        console.log("Formulaire de connexion détecté, activation du bouton...");
        btnSignin.addEventListener("click", checkCredentials);
    } else {
        // Si ce message s'affiche, c'est que ton Router n'a pas encore fini l'injection
        console.error("Impossible de trouver le formulaire ou le bouton de connexion.");
    }

    function checkCredentials() {
        console.log("Clic détecté : lancement de la vérification...");
        let dataForm = new FormData(signinForm);

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // On prépare les données pour Symfony
        let raw = JSON.stringify({
            "username": dataForm.get("email"),
            "password": dataForm.get("mdp"),
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        // URL directe pour éviter les soucis de variable apiUrl
        fetch("http://127.0.0.1:8001/api/login", requestOptions)
            .then((response) => {
                console.log("Statut réponse Symfony :", response.status);
                if (response.ok) {
                    return response.json();
                } else {
                    // On affiche l'erreur visuelle sur les inputs
                    mailInput.classList.add("is-invalid");
                    passwordInput.classList.add("is-invalid");
                    throw new Error("Identifiants incorrects");
                }
            })
            .then(result => {
                console.log("Connexion réussie ! Stockage des données...");
                
                // Stockage du token (vérifie que ta fonction setToken est accessible)
                setToken(result.apiToken);

                // Stockage du rôle (on utilise le premier rôle du tableau envoyé par Symfony)
                setCookie("role", result.roles[0], 7); 
                
                // Redirection via le système SPA
                window.location.replace("/");
            })
            .catch((error) => {
                console.error("Détails de l'erreur :", error);
            });
    }
}