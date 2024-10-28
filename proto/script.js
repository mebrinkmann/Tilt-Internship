document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Check if data is fetched correctly
            
            // Populate each carousel
            populateCarousel('unreleased-this-week', data.topUnreleasedIndieGamesThisWeek);
            populateCarousel('trending-this-week', data.trendingUnreleasedIndieGamesThisWeek);
            populateCarousel('featured-unreleased', data.featuredUnreleasedIndieGames);
            populateCarousel('trending-free', data.trendingFreeIndieGames);
            populateCarousel('trending-sale', data.trendingIndieGamesOnSale);
            populateCarousel('full-price', data.trendingIndieGamesFullPrice);
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
});

// Function to populate the carousels
function populateCarousel(carouselId, appIds) {
    const carousel = document.getElementById(carouselId).querySelector('.carousel-inner');
    if (!carousel || !appIds || appIds.length === 0) return;

    // Create a document fragment to batch append elements
    const fragment = document.createDocumentFragment();

    appIds.forEach((appId, index) => {
        // Create the carousel item element
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        if (index === 0) item.classList.add('active'); // Mark the first item as active

        item.innerHTML = `
            <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_231x87.jpg" alt="Game ${appId}" loading="lazy">
            <div class="carousel-info">
                <h4>Loading...</h4>
                <p>Loading description...</p>
                <a href="https://store.steampowered.com/app/${appId}/?curator_clanid=44087493" target="_blank" class="btn">View on Steam</a>
            </div>
        `;
        fragment.appendChild(item);

        console.log(`Added item for ${appId} to ${carouselId}`); // Log when an item is added

        // Fetch additional details for the game
        fetchGameDetails(appId, item);
    });

    // Append the fragment to the carousel at once
    carousel.appendChild(fragment);
}

// Function to fetch game details
function fetchGameDetails(appId, item) {
    fetch(`https://store.steampowered.com/api/appdetails/?appids=${appId}`)
        .then(response => response.json())
        .then(gameData => {
            const gameDetails = gameData[appId]?.data; // Safely access game data
            if (gameDetails && gameDetails.success) {
                const gameName = gameDetails.name;
                const shortDescription = gameDetails.short_description || 'No description available.';
                const releaseDateInfo = gameDetails.release_date;
                const releaseDate = releaseDateInfo.coming_soon ? 'Coming Soon' : releaseDateInfo.date;

                // Update the item with the fetched details
                item.querySelector('h4').textContent = gameName;
                item.querySelector('p').textContent = `${shortDescription} - ${releaseDate}`;
            } else {
                console.error('Game details not found or request unsuccessful:', gameData);
                item.querySelector('h4').textContent = 'Details not available';
                item.querySelector('p').textContent = 'Failed to load game details.';
            }
        })
        .catch(error => {
            console.error('Error fetching game details:', error);
            item.querySelector('h4').textContent = 'Error loading details';
            item.querySelector('p').textContent = 'Please try again later.';
        });
}
