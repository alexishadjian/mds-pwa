document.addEventListener('DOMContentLoaded', async () => {

    const detailsContainer = document.querySelector('.details-container');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');


    if (!id) {
        console.error("Identifiant non spécifié");
        return;
    }

    try {
        const response = await fetch('https://api.tvmaze.com/shows/' + id);
        const data = await response.json();

        const title = data.name;
        const summary = data.summary || 'No summary';
        const image = data.image ? data.image.medium : 'No image';
        
        detailsContainer.innerHTML = `
            <h2 class="text-2xl mb-5">${title}</h2>
            <img src="${image}" class="mb-5" alt="${title}">
            <p>${summary}</p>
        `;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails', error);
    }

});