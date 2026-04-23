{
    const urlParams = new URLSearchParams(window.location.search);
    const resaId = urlParams.get('id');

    const loadResaToCancel = async () => {
        if (!resaId) return;

        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        try {
            // On récupère toutes les résas pour trouver la bonne (ou une route API spécifique si elle existe)
            const response = await fetch(apiUrl + "reservations", {
                method: 'GET',
                headers: myHeaders
            });

            if (response.ok) {
                const reservations = await response.json();
                // On cherche la réservation qui correspond à l'ID de l'URL
                const resa = reservations.find(r => r.id == resaId);

                if (resa) {
                    document.getElementById("displayDate").textContent = resa.date;
                    document.getElementById("displayHour").textContent = resa.heure;
                    document.getElementById("displayConvives").textContent = resa.nbConvives;
                    document.getElementById("displayAllergies").textContent = resa.allergies || "Aucune";
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        }
    };

    const confirmDeletion = async () => {
        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        try {
            const response = await fetch(apiUrl + "reservations/" + resaId, {
                method: 'DELETE',
                headers: myHeaders
            });

            if (response.ok) {
                alert("Réservation annulée.");
                // Redirection vers la liste mise à jour
                window.history.pushState({}, "", "/allResa");
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    // Initialisation
    loadResaToCancel();
    
    const btnAnnul = document.getElementById("btn-confirm-annul");
    if(btnAnnul) btnAnnul.onclick = confirmDeletion;
}