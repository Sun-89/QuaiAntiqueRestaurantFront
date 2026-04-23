{
    // 1. Définition de la fonction de récupération des données
    const loadAllReservations = async () => {
        const container = document.querySelector(".allreservations");

        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken()); // Récupération du token pour l'accès sécurisé

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            // Appel à la route GET que nous avons ajoutée au Controller
            const response = await fetch(apiUrl + "reservations", requestOptions);

            if (response.ok) {
                const reservations = await response.json();
                renderReservations(reservations);
            } else {
                container.innerHTML = "<p class='text-danger'>Erreur lors de la récupération des réservations.</p>";
            }
        } catch (error) {
            console.error("Erreur technique :", error);
            if(container) container.innerHTML = "<p>Impossible de joindre le serveur.</p>";
        }
    };

    // 2. Fonction pour injecter le HTML dynamiquement
    const renderReservations = (data) => {
        const container = document.querySelector(".allreservations");
        if (!container) return;

        container.innerHTML = ""; // On vide les <a> statiques du fichier HTML

        if (data.length === 0) {
            container.innerHTML = "<p>Vous n'avez pas encore de réservation.</p>";
            return;
        }

        data.forEach(resa => {
            // On crée une structure propre pour chaque réservation
            // Note l'ajout de ?id=${resa.id} pour l'annulation
            const resaCard = `
                <div class="reservation-card mb-4 p-3 border rounded shadow-sm">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Date :</strong> ${resa.date} <br>
                            <strong>Heure :</strong> ${resa.heure} (${resa.service}) <br>
                            <strong>Convives :</strong> ${resa.nbConvives} <br>
                            <strong>Allergies :</strong> ${resa.allergies ? resa.allergies : "Aucune"}
                        </div>
                        <div>
                            <a href="/annulResa?id=${resa.id}" class="btn btn-outline-danger btn-sm" onclick="route(event)">
                                Annuler
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += resaCard;
        });
    };

    // 3. Lancement automatique au chargement du script
    loadAllReservations();
}