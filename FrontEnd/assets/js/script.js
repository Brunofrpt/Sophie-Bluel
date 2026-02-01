//*********************************************************
// Données*/
//****************************************************** */


//*********************************************************
// État*/
//****************************************************** */

let listeWorks = [];

let listeCategories = [];

const token = localStorage.getItem("token");

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

const logInOut = document.getElementById("login-out");
const bandeauNoir = document.querySelector(".bandeau-noir");
const blocFIltres = document.querySelector(".bloc-filtres");
const btnModifierProjets = document.querySelector(".modifier-projets");
const modaleGalerie = document.getElementById("modale-gallerie");
const listeImagesModale = document.querySelector(".images-modales");
const iconeCroixFermeture = document.querySelector(".fermeture-modale");
const btnAjouterPhoto = document.querySelector(".btn-ajouter-img");
const btnRetourGalerie = document.querySelector(".retour");
const vueListe = document.querySelector(".vue-liste");
const vueAjout = document.querySelector(".vue-ajout");
const btnValiderFormulaire = document.querySelector(".btn-valider");
const titreModale = document.querySelector("#titre-modale");
const select = document.getElementById("categorie-photo");
const inputImage = document.getElementById("fichier-photo");
const previewImg = document.getElementById("preview-img");
const iconefigureForm = document.querySelector(".fa-image");
const labelFigureForm = document.querySelector(".btn-photo-modale");
const figcaptionFigureForm = document.querySelector(".restrictions");
const inputTitrePhoto = document.getElementById("titre-photo");
const zoneAjoutPhoto = document.querySelector(".zone-ajout-photo");
const formAjoutPhoto = document.getElementById("form-ajout-photo");


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

async function chargerCategoriesForm() {
    const reponseApiCategories = await fetch(`${apiUrl}/categories`);

    if (!reponseApiCategories.ok) {
        console.error("Erreur chargement API:", reponseApiCategories.status, reponseApiCategories.statusText);
    } else {
        listeCategories = await reponseApiCategories.json();
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

function remplirModaleImagesWorks() {
    listeImagesModale.innerHTML = "";


    for (let i = 0; i < listeWorks.length; i++) {

        const work = listeWorks[i];

        const figure = document.createElement("figure");
        const imageModale = document.createElement("img");
        imageModale.src = work.imageUrl;
        const btnCorbeille = document.createElement("button");
        btnCorbeille.classList.add("btn-corbeille");
        btnCorbeille.setAttribute("aria-label", "supprimer")
        btnCorbeille.dataset.id = work.id;
        const logoCorbeille = document.createElement("i");
        logoCorbeille.classList.add("fa-solid", "fa-trash-can");

        figure.appendChild(imageModale);
        figure.appendChild(btnCorbeille);
        listeImagesModale.appendChild(figure);
        btnCorbeille.appendChild(logoCorbeille);

    }
}

function auClicModifier(event) {

    remplirModaleImagesWorks();
    ecouterClicBtnCorbeille();
    modaleGalerie.showModal();
}

function fermerModaleX(event) {
    modaleGalerie.close();

}

function fermerModale(event) {
    if (event.target === event.currentTarget) {
        modaleGalerie.close();
    }
}

async function supprimerWork(idWork) {
    const reponseApiWorks = await fetch(`${apiUrl}/works/${idWork}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!reponseApiWorks.ok) {
        console.error("Erreur chargement :", reponseApiWorks.status);
        return;
    }

    await chargerWorksDepuisApi();

    remplirModaleImagesWorks();

    const divGallery = recupererElement(".gallery");
    afficherWorks(divGallery, listeWorks);
}

function remplirFormCategories() {
    for (let i = 0; i < listeCategories.length; i++) {

        const categorie = listeCategories[i];

        const option = document.createElement("option");
        option.value = categorie.id;
        option.text = categorie.name;

        select.appendChild(option);

    }
}

async function nomATrouver() {
    await chargerCategoriesForm();
    remplirFormCategories();

}

function majBtnEnvoyer() {

}

function afficherMessageErreurFormulaire(dansElement) {
    const messagesErreur = dansElement.querySelectorAll(".message-erreur")
    for (let i = 0; i < messagesErreur.length; i++) {
        messagesErreur[i].remove();
    }

    const messageErreurForm = document.createElement("p");
    messageErreurForm.classList.add("message-erreur")
    messageErreurForm.innerText = "Vous devez remplir tous les elements du formulaire";

    dansElement.appendChild(messageErreurForm);

}

function verifierFormMarquerErreur() {

    // reset
    zoneAjoutPhoto.classList.remove("champ-erreur");
    inputTitrePhoto.classList.remove("champ-erreur");
    select.classList.remove("champ-erreur");

    // tests
    const titreVide = inputTitrePhoto.value.trim().length === 0;
    const imageAbsente = !inputImage.files[0];
    const categorieNonChoisie = select.value === "";

    // marque des champs
    if (titreVide) inputTitrePhoto.classList.add("champ-erreur");
    if (imageAbsente) zoneAjoutPhoto.classList.add("champ-erreur");
    if (categorieNonChoisie) select.classList.add("champ-erreur");

    // formulaire valide 
    const formValide = !titreVide && !imageAbsente && !categorieNonChoisie;

    // gerer bouton

    if (formValide) btnValiderFormulaire.classList.remove("btn-valider-disabled");
    else btnValiderFormulaire.classList.add ("btn-valider-disabled");


    return formValide;//renvoi true ou false

}

function auChangementImage(event) {
  afficherPreviewImage(event);
  verifierFormMarquerErreur();
}

function auSubmitAjoutPhoto(event) {

  const ok = verifierFormMarquerErreur();
  if (!ok) {
    event.preventDefault();
    afficherMessageErreurFormulaire(formAjoutPhoto); // message dans la modale
  }
}



//*********************************************************
// Événements*/
//****************************************************** */
function ecouterClicBtnCorbeille() {

    listeImagesModale.addEventListener("click", function (event) {
        const btnSupprimer = event.target.closest(".btn-corbeille");
        if (!btnSupprimer) return;
        const idWork = btnSupprimer.dataset.id;
        supprimerWork(idWork);
    });
}

function basculerVueAjout(event) {
    vueListe.classList.add("oculter");
    btnRetourGalerie.classList.remove("oculter");
    btnAjouterPhoto.classList.add("oculter");
    btnValiderFormulaire.classList.remove("oculter");
    titreModale.innerText = "Ajout photo";
    vueAjout.classList.remove("oculter");

}

function basculerVueGalerie(event) {
    vueAjout.classList.add("oculter");
    vueListe.classList.remove("oculter");
    btnRetourGalerie.classList.add("oculter");
    btnAjouterPhoto.classList.remove("oculter");
    btnValiderFormulaire.classList.add("oculter");
    titreModale.innerText = "Galerie photo";
}

function afficherPreviewImage(event) {
    console.log("preview: change détecté");
    const inputContenu = inputImage.files[0];
    if (!inputContenu) return;

    const url = URL.createObjectURL(inputContenu);
    previewImg.src = url;
    previewImg.classList.remove("oculter");
    iconefigureForm.classList.add("oculter");
    labelFigureForm.classList.add("oculter");
    figcaptionFigureForm.classList.add("oculter");

    previewImg.onload = () => URL.revokeObjectURL(url);

}

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

    console.log("token page accueil =", localStorage.getItem("token"));
}

initialisation();


if (token !== null && token !== undefined) {
    logInOut.textContent = "logout";
    logInOut.href = "#";

    bandeauNoir.classList.remove("oculter");
    blocFIltres.remove();
    btnModifierProjets.classList.remove("oculter");

    logInOut.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
    });

    btnModifierProjets.addEventListener("click", auClicModifier);
    iconeCroixFermeture.addEventListener("click", fermerModale);
    modaleGalerie.addEventListener("click", fermerModale);
    btnAjouterPhoto.addEventListener("click", basculerVueAjout);
    btnRetourGalerie.addEventListener("click", basculerVueGalerie);
    inputImage.addEventListener("change", auChangementImage);
    inputTitrePhoto.addEventListener("input", verifierFormMarquerErreur);
    select.addEventListener("change", verifierFormMarquerErreur);
    formAjoutPhoto.addEventListener("submit", auSubmitAjoutPhoto);


    nomATrouver();

}











