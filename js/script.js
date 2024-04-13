console.log('script.js !')

const form = document.querySelector('form');
const resultContainer = document.querySelector('.result-container');
let data;


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    const searchQuery = formData.get('search');
    
    try {
        resultContainer.classList.remove('hidden');
        const response = await fetch('https://api.tvmaze.com/search/shows?q=' + searchQuery);
        data = await response.json();
        
    } catch (error) {
        console.error('Erreur lors de la recherche :', error);
        resultContainer.classList.add('hidden');
        const offlineGameConainer = document.querySelector('.game-container');
        offlineGameConainer.classList.remove('hidden');
    }

    // Clean previous results
    resultContainer.innerHTML = '';

    // Display new results
    data.forEach(result => {

        const title = result.show.name;
        const summary = result.show.summary || 'No summary';
        const image = result.show.image ? result.show.image.medium : 'No image';
        const id = result.show.id;

        
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="mb-4 flex gap-4 relative">
                <a href="/details.html?id=${id}" class="absolute inset-0"></a>
                <div>
                    <img class="w-40 max-w-none" src="${image}"/>
                </div>
                <div>
                    <h2 class="text-xl mb-2 font-medium">${title}</h2>
                    <p>${summary}</p>
                <div>
            </div>
        `;
        
        resultContainer.appendChild(element);

    });

});