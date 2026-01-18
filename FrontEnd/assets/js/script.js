const apiUrl ="http://localhost:5678/api";

const reponseServeurApiListeProjets = await fetch (`${apiUrl}/works`);
const listeProjetsWorks = await reponseServeurApiListeProjets.json();

console.log (listeProjetsWorks) // a supprimer

const divGallery = document.querySelector (".gallery");

function tousLesWorks(listeProjetsWorks) {

    for (let i = 0; i < listeProjetsWorks.length; i ++) {

        const creerElementWorks = document.createElement ("figure");

        const creerImageElementWorks = document.createElement ("img");
        creerImageElementWorks.src = listeProjetsWorks[i].imageUrl;

        const creerTitreElementWorks = document.createElement ("figcaption");
        creerTitreElementWorks.innerText = listeProjetsWorks[i].title;

        console.log(i)
        console.log(listeProjetsWorks[i].title)
        console.log(creerElementWorks, creerImageElementWorks, creerTitreElementWorks)

        divGallery.appendChild(creerElementWorks);

        creerElementWorks.appendChild(creerImageElementWorks);
        creerElementWorks.appendChild(creerTitreElementWorks);
    }

}
tousLesWorks(listeProjetsWorks)

