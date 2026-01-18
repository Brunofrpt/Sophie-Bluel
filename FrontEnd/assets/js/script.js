//*********************************************************
// Données*/
//****************************************************** */

//*********************************************************
// État*/
//****************************************************** */

let listeProjetsWorks = [];

//*********************************************************
// DOM (élements de la page) Fonction réutilisable */
//****************************************************** */

function recupererElement(selector) {
    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Erreur : l'élément "${selector}" est introuvable dans le HTML.`);
        return null;
    }

    return element;
}

//*********************************************************
// API */
//****************************************************** */

const apiUrl = "http://localhost:5678/api";

async function recupererListeWorks() {
    const reponseServeurApiListeProjets = await fetch(`${apiUrl}/works`);

    if (!reponseServeurApiListeProjets.ok) {
        console.error("Erreur API:", reponseServeurApiListeProjets.status, reponseServeurApiListeProjets.statusText);
    } else {
        listeProjetsWorks = await reponseServeurApiListeProjets.json();
    }

}


//*********************************************************
// Fonctions*/
//****************************************************** */
function afficherMessageAucunProjet(divGallery) {
    divGallery.innerHTML = "";
    const p = document.createElement("p");
    p.innerText = "Aucun projet pour le moment.";
    divGallery.appendChild(p);
}

function afficherLesWorks(divGallery) {

    divGallery.innerHTML="";

    //  Si la liste est vide → message
    if (!listeProjetsWorks || listeProjetsWorks.length === 0) {
        afficherMessageAucunProjet(divGallery);
        return;
    }

    for (let i = 0; i < listeProjetsWorks.length; i++) {

        const creerElementWorks = document.createElement("figure");

        const creerImageElementWorks = document.createElement("img");
        creerImageElementWorks.src = listeProjetsWorks[i].imageUrl;

        const creerTitreElementWorks = document.createElement("figcaption");
        creerTitreElementWorks.innerText = listeProjetsWorks[i].title;

        divGallery.appendChild(creerElementWorks);

        creerElementWorks.appendChild(creerImageElementWorks);
        creerElementWorks.appendChild(creerTitreElementWorks);
    }

}

//*********************************************************
// Événements*/
//****************************************************** */

//*********************************************************
// Initialisation*/
//****************************************************** */

async function initialisation() {
    const divGallery = recupererElement(".gallery");
    if (!divGallery) return;

    await recupererListeWorks();
    afficherLesWorks(divGallery);
}

initialisation();





