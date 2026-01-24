//*********************************************************
// Données*/
//****************************************************** */

//*********************************************************
// État*/
//****************************************************** */

let listeWorks = [];

//*********************************************************
// DOM (élements de la page) Fonction réutilisable */
//****************************************************** */

function recupererElement(selecteurCSS) {
    const element = document.querySelector(selecteurCSS);

    if (!element) {
        console.error(`Erreur : l'élément "${selecteurCSS}" est introuvable dans le HTML.`);
        return null;
    }

    return element;
}

//*********************************************************
// API */
//****************************************************** */

const apiUrl = "http://localhost:5678/api";

async function chargerWorksDepuisApi() {
    const reponseApiWorks = await fetch(`${apiUrl}/works`);

    if (!reponseApiWorks.ok) {
        console.error("Erreur API:", reponseApiWorks.status, reponseApiWorks.statusText);
    } else {
        listeWorks = await reponseApiWorks.json();
    }

}


//*********************************************************
// Fonctions*/
//****************************************************** */
function afficherMessageAucunProjet(dansElement) {
    dansElement.innerHTML = "";
    const p = document.createElement("p");
    p.innerText = "Aucun projet pour le moment.";
    dansElement.appendChild(p);
}

function afficherWorks(dansElement, worksAAfficher) {

    dansElement.innerHTML = "";

    //  Si la liste est vide → message
    if (!worksAAfficher || worksAAfficher.length === 0) {
        afficherMessageAucunProjet(dansElement);
        return;
    }

    for (let i = 0; i < worksAAfficher.length; i++) {

        const work = worksAAfficher[i]

        const figureWorks = document.createElement("figure");

        const imgWork = document.createElement("img");
        imgWork.src = work.imageUrl;

        const titreWork = document.createElement("figcaption");
        titreWork.innerText = work.title;

        dansElement.appendChild(figureWorks);

        figureWorks.appendChild(imgWork);
        figureWorks.appendChild(titreWork);
    }

}

function brancherBoutonFiltres(listeBoutonsFiltres, classeActive, fonctionApresClique) {

    for (let i = 0; i < listeBoutonsFiltres.length; i++) {
        listeBoutonsFiltres[i].addEventListener("click", function (event) {

            // Retirer class active sur tous les boutons filtres
            for (let j = 0; j < listeBoutonsFiltres.length; j++) {
                listeBoutonsFiltres[j].classList.remove(classeActive);
            }

            const boutonClique = event.currentTarget;

            // ajoute la classe active sur le bouton cliqué
            boutonClique.classList.add(classeActive);

            //prépare la fonction de filtrage
            if (fonctionApresClique) {
                fonctionApresClique(boutonClique);
            }

        });
    }

}

function filtrerWorksParCategorie(boutonClique) {
    const filtreChoisi = boutonClique.dataset.category;

    let worksAAfficher = []

    if (filtreChoisi === "tous") {
        worksAAfficher = listeWorks
    } else {
        worksAAfficher = listeWorks.filter(function (work) {
            return work.category.name === filtreChoisi
        });
    }
    return worksAAfficher;
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

    await chargerWorksDepuisApi();
    afficherWorks(divGallery, listeWorks);

    const listeBoutonsFiltres = document.querySelectorAll(".boutons-filtres");
    brancherBoutonFiltres(listeBoutonsFiltres, "actif", function (boutonClique) {
        const worksAAfficher = filtrerWorksParCategorie(boutonClique);
        afficherWorks(divGallery, worksAAfficher);
    }
    );
}

initialisation();





