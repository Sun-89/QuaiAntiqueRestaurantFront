//Implémenter le JS de ma page

const inputNom = document.getElementById("NomInput");
const inputPreNom = document.getElementById("PrenomInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const btnValidation = document.getElementById("btn-validation-inscription");
const formInscription = document.getElementById("formulaireInscription")

inputNom.addEventListener("input", validateForm); 
inputPreNom.addEventListener("input", validateForm);
inputMail.addEventListener("input", validateForm);
inputPassword.addEventListener("input", validateForm);
inputValidationPassword.addEventListener("input", validateForm);
btnValidation.addEventListener("click", inscrireUtilisateur);


//Function permettant de valider tout le formulaire
function validateForm(){
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPreNom);
    const mailOk = validateMail(inputMail);
    const passwordOk = validatePassword(inputPassword);
    const passwordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);

    if(nomOk && prenomOk && mailOk && passwordOk && passwordConfirmOk){
        btnValidation.disabled = false;
        btnValidation.style.cursor = "pointer";
    }
    else{
        btnValidation.disabled = true;
        btnValidation.style.cursor = "not-allowed";
    }
}

function validateMail(input){
    //definir mon regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;
    if(mailUser.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;

    }
}

function validateConfirmationPassword(inputPwd, inputConfirmPwd){
    if(inputPwd.value !== "" && inputPwd.value === inputConfirmPwd.value){
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    }
    else{
        inputConfirmPwd.classList.add("is-invalid");
        inputConfirmPwd.classList.remove("is-valid");
        return false;
    }
}

function validatePassword(input){
    //Définir mon regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if(passwordUser.match(passwordRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateRequired(input){
    if(input.value != ''){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function inscrireUtilisateur(){
    let dataForm = new FormData(formInscription);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "firstName": dataForm.get("nom"),
        "lastName": dataForm.get("prenom"),
        "email": dataForm.get("email"),
        "password": dataForm.get("mdp"),
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiUrl+"registration", requestOptions)
    .then((response) => {
        if(response.ok){
        return response.json();
        }
        else{
            alert("Erreur lors de l'inscription");
        }
    })
    .then(result =>  {
        alert(`Bonjour ${inputPreNom.value}, vous etes maintenant inscrit, vous pouvez vous connecter`)
        window.history.pushState({}, "", "/signin");
        if (typeof showPageHierarchy === 'function') {
            showPageHierarchy(); 
        } else {
            // Si tu n'es pas sûr du nom de la fonction, 
            // cette solution de secours forcera le retour à l'index (qui lui fonctionne)
            window.location.replace("/");
        }
    })
    .catch((error) => console.error(error));
}