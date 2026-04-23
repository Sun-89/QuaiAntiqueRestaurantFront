// reserver.js

// 1. Définition des plages horaires (en attendant ton API)
const horairesMidi = ["12:00", "12:30", "13:00", "13:30"];
const horairesSoir = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

const selectHour = document.getElementById("selectHour");
const midiRadio = document.getElementById("midiRadio");
const soirRadio = document.getElementById("SoirRadio");

// 2. Fonction pour remplir le select
const updateHours = () => {
    const hours = midiRadio.checked ? horairesMidi : horairesSoir;
    
    // On vide le select actuel
    selectHour.innerHTML = "";

    // On ajoute les nouvelles options
    hours.forEach(hour => {
        const option = document.createElement("option");
        option.value = hour;
        option.textContent = hour;
        selectHour.appendChild(option);
    });
};

// 3. Écouteurs d'événements sur les boutons radio
midiRadio.addEventListener("change", updateHours);
soirRadio.addEventListener("change", updateHours);

// 4. On modifie ta fonction existante pour intégrer la logique
const loadUserForReservation = async () => {
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    try {
        const response = await fetch(apiUrl + "me", { 
            method: 'GET', 
            headers: myHeaders 
        });

        if (response.ok) {
            const user = await response.json();
            
            if(document.getElementById("NomInput")) document.getElementById("NomInput").value = user.nom || '';
            if(document.getElementById("PrenomInput")) document.getElementById("PrenomInput").value = user.prenom || '';
            if(document.getElementById("AllergieInput")) document.getElementById("AllergieInput").value = user.allergies || '';
            
            // Initialisation des heures au chargement
            updateHours(); 
        }
    } catch (error) {
        console.error("Erreur chargement :", error);
    }
};

loadUserForReservation();

const formReserver = document.getElementById("form-reserver");


if (formReserver) {
    formReserver.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const data = {
            nom: document.getElementById("NomInput").value,
            prenom: document.getElementById("PrenomInput").value,
            allergies: document.getElementById("AllergieInput").value,
            nbConvives: document.getElementById("NbConvivesInput").value,
            date: document.getElementById("DateInput").value,
            service: document.querySelector('input[name="serviceChoisi"]:checked').id === "midiRadio" ? "Midi" : "Soir",
            heure: document.getElementById("selectHour").value
        };

        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());
        myHeaders.append("Content-Type", "application/json");

        try {
            const response = await fetch(apiUrl + "reservations/new", { // On va créer cette route juste après
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("Réservation confirmée !");
                const dummyEvent = { 
                    preventDefault: () => {}, 
                    target: { href: window.location.origin + "/allResa" } 
                };
                route(dummyEvent);
            } else {
                alert("Erreur lors de la réservation.");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    });
}