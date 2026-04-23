const galerieImage = document.getElementById("allImages");
const btnAddPhoto = document.getElementById("btn-add-photo");
const formImage = document.getElementById("form-image");

/**
 * 1. CHARGEMENT INITIAL
 * On récupère les images depuis le Backend au chargement de la page.
 */
const loadGallery = async () => {
    try {
        const response = await fetch(apiUrl + "images"); // Route GET de ton GalleryController
        const images = await response.json();
        
        galerieImage.innerHTML = ""; 

        if (!images || images.length === 0) {
            galerieImage.innerHTML = "<p class='text-white text-center w-100'>La galerie est vide.</p>";
        } else {
            images.forEach(img => {
                // On construit l'URL complète vers ton dossier public/uploads du Backend
                const fullUrl = "http://127.0.0.1:8001" + img.path;
                galerieImage.innerHTML += getImage(img.titre, fullUrl, img.id);
            });
        }
    } catch (error) {
        console.error("Erreur de chargement de la galerie :", error);
    }
    
    // Une fois la galerie chargée, on gère l'affichage des éléments Admin
    showAdminElements();
};

/**
 * 2. GESTION DES RÔLES
 * Affiche le bouton "Ajouter" et les icônes d'édition si l'utilisateur est admin.
 */
const showAdminElements = () => {
    const userRole = getRole(); // Récupère le rôle (ex: ["ROLE_ADMIN"])
    
    // Vérification flexible : si userRole est une string ou un tableau contenant ROLE_ADMIN
    const isAdmin = userRole === "ROLE_ADMIN" || (Array.isArray(userRole) && userRole.includes("ROLE_ADMIN"));

    if (isAdmin && btnAddPhoto) {
        btnAddPhoto.classList.remove("d-none");
    }
};

/**
 * 3. GÉNÉRATION DU HTML
 * Crée la carte d'image avec les boutons d'action si Admin.
 */
function getImage(titre, urlImage, id) {
    titre = sanitizeHtml(titre);
    urlImage = sanitizeHtml(urlImage);
    const userRole = getRole();
    const isAdmin = userRole === "ROLE_ADMIN" || (Array.isArray(userRole) && userRole.includes("ROLE_ADMIN"));

    let adminButtons = "";
    if (isAdmin) {
        adminButtons = `
            <div class="action-image-buttons">
                <button type="button" class="btn btn-sm btn-outline-light" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-light" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;
    }

    return `
        <div class="col p-3"id="image-container-${id}">
            <div class="image-card text-white">
                <img src="${urlImage}" class="rounded w-100" alt="${titre}"/>
                <p class="titre-image">${titre}</p>
                ${adminButtons}
            </div>
        </div>`;
}

/**
 * 4. ENVOI DU FORMULAIRE (POST)
 * Envoie le titre et le fichier image au GalleryController.
 */
if (formImage) {
    formImage.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("titre", document.getElementById("NameInputPhoto").value);
        formData.append("image", document.getElementById("ImageInput").files[0]);

        const myHeaders = new Headers();
        myHeaders.append("X-AUTH-TOKEN", getToken());

        try {
            const response = await fetch("http://127.0.0.1:8001/api/images/new", {
                method: 'POST',
                headers: {
                    "X-AUTH-TOKEN": getToken()
                },
                body: formData // FormData gère automatiquement le Content-Type multi-part
            });

            if (response.ok) {
                alert("Image ajoutée avec succès !");
                loadGallery(); // Recharge la galerie pour afficher la nouvelle image
            } else {
                const errorData = await response.json();
                alert("Erreur : " + (errorData.error || "Impossible d'ajouter l'image"));
            }
        } catch (error) {
            console.error("Erreur technique lors de l'envoi :", error);
        }
    });
}

async function deleteImage(id) {
    if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8001/api/images/${id}`, {
                method: 'DELETE',
                headers: {
                    "X-AUTH-TOKEN": getToken()
                }
            });

            if (response.ok) {
                alert("Image supprimée !");
                // On retire l'élément du DOM sans recharger la page
                document.getElementById(`image-container-${id}`).remove();
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur technique :", error);
        }
    }
}

// Lancement du script
loadGallery();  
