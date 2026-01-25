//*********************************************************
// Données*/
//****************************************************** */

//*********************************************************
// État*/
//****************************************************** */

//*********************************************************
// DOM (élements de la page) Fonction réutilisable */
//****************************************************** */
const formulaire = document.getElementById("login-form");
const zoneMail = document.getElementById("email");
const zonePassword = document.getElementById("password");
//*********************************************************
// API */
//****************************************************** */
const apiUrl = "http://localhost:5678/api";


//*********************************************************
// Fonctions*/
//****************************************************** */

//*********************************************************
// Événements*/
//****************************************************** */
zoneMail.addEventListener ("input", function() {
    zoneMail.classList.remove ("champ-erreur")
});
zonePassword.addEventListener ("input", function () {
    zonePassword.classList.remove ("champ-erreur")
});

formulaire.addEventListener("submit", async function (event) {
    event.preventDefault();

    const mailSaisi = zoneMail.value;
    const passwordSaisi = zonePassword.value;

    const reponseLogin = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mailSaisi, password: passwordSaisi }),
    });

    if (!reponseLogin.ok) {

        const messagesErreur = document.querySelectorAll (".message-erreur")
        for (let i = 0; i <messagesErreur.length; i ++) {
            messagesErreur[i].remove();
        }
        zoneMail.classList.remove ("champ-erreur");
        zonePassword.classList.remove ("champ-erreur");

        const messageErreurConnexion = document.createElement ("p");
        messageErreurConnexion.classList.add ("message-erreur")
        messageErreurConnexion.innerText = `Erreur dans l’identifiant ou le mot de passe ${reponseLogin.status}`;
        zoneMail.classList.add ("champ-erreur");
        zonePassword.classList.add ("champ-erreur");

        formulaire.appendChild(messageErreurConnexion);
        console.log(messageErreurConnexion);
        return;
    }
    const tokenRecu = await reponseLogin.json();

    console.log("token reçu:", tokenRecu.token);

    localStorage.setItem("token", tokenRecu.token)
    window.location.href = "index.html";
})






//*********************************************************
// Initialisation*/
//****************************************************** */

