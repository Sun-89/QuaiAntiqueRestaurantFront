const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById ("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials(){
    //Ici il faudra appeler l'API pour verifier les credentials en base de données

    if(mailInput.value == "test@mail.com" && passwordInput.value == "Test@123"){
        
        //Il faudra récupérer le vrai token 
        const token = "kjbgblbhybibuvbli"
        setToken(token);
    
        //Placer le token en cookie

        setCookie(roleCookieName, "admin", 7);
        window.location.replace("/");
    }
    else{
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }

}