{
    const formAccount = document.getElementById("form-account");
    const msgDiv = document.getElementById("message-account");

    const loadUserData = async () => {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        try {
            const response = await fetch(apiUrl + "me", { 
                method: 'GET', 
                headers: myHeaders 
            });

            if (response.ok) {
                const user = await response.json();
                document.getElementById("NomInput").value = user.nom || '';
                document.getElementById("PrenomInput").value = user.prenom || '';
                document.getElementById("EmailInput").value = user.email || '';
                document.getElementById("AllergieInput").value = user.allergies || '';
            }
        } catch (error) {
            console.error("Erreur chargement :", error);
        }
    };

    if (formAccount) {
        formAccount.addEventListener("submit", async (e) => {
            e.preventDefault(); // <--- C'EST CA QUI EMPECHE LA PAGE BLANCHE

            const data = {
                nom: document.getElementById("NomInput").value,
                prenom: document.getElementById("PrenomInput").value,
                allergies: document.getElementById("AllergieInput").value
            };

            const myHeaders = new Headers();
            myHeaders.append("X-AUTH-TOKEN", getToken());
            myHeaders.append("Content-Type", "application/json");

            try {
                const response = await fetch(apiUrl + "edit-account", {
                    method: 'PUT',
                    headers: myHeaders,
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    msgDiv.innerHTML = '<div class="alert alert-success">✅ Modification réussie !</div>';
                    setTimeout(() => { msgDiv.innerHTML = ""; }, 3000);
                } else {
                    msgDiv.innerHTML = '<div class="alert alert-danger">❌ Erreur serveur.</div>';
                }
            } catch (error) {
                msgDiv.innerHTML = '<div class="alert alert-danger">❌ Serveur injoignable.</div>';
            }
        });
    }

    loadUserData();
}