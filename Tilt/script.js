document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const slidesContainer = document.getElementById('slide-viewer');
            const slides1 = data.topUnreleasedIndieGamesThisWeek;
            const slides2 = data.trendingUnreleasedIndieGamesThisWeek;
            const slides3 = data.featuredUnreleasedIndieGames;
            const slides4 = data.trendingFreeIndieGames;
            const slides5 = data.trendingIndieGamesOnSale;
            const slides6 = data.trendingIndieGamesFullPrice;
            console.log('Fetched data:', data); // Check if data is fetched correctly
            
            // Populate each carousel
            populateCarousel('unreleased-this-week', slides1);
            populateCarousel('trending-this-week', slides2);
            populateCarousel('featured-unreleased', slides3);
            populateCarousel('trending-free', slides4);
            populateCarousel('trending-sale', slides5);
            populateCarousel('full-price', slides6);
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
});

// Function to populate the carousels
function populateCarousel(carouselId, appIds) {
    const carousel = document.getElementById(carouselId).querySelector('.slide-group');
    if (!carousel || !appIds || appIds.length === 0) return;

    // Create a document fragment to batch append elements
    const fragment = document.createDocumentFragment();

    // Append the fragment to the carousel at once
    carousel.appendChild(fragment);
}

appIds.forEach((appId, index) => {
        forEach((appId, index) => {
        const slideItem = document.createElement('div');
        slideItem.classList.add('slide-item');
        slideItem.id = `slide-${index}`;

        forEach(appId => {
            slide-item.innerHTML`
            <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_231x87.jpg" alt="Game ${appId}" loading="lazy">
            <div class="carousel-info">
                <h4>Loading...</h4>
                <p>Loading description...</p>
                <a href="https://store.steampowered.com/app/${appId}/?curator_clanid=44087493" target="_blank" class="btn">View on Steam</a>
            </div>
            `;
        });

    slidesContainer.appendChild(slideItem);
});

    let currentIndex = 0;
    
    fragment.appendChild(item);

    console.log(`Added item for ${appId} to ${carouselId}`); // Log when an item is added

    // Fetch additional details for the game
    fetchGameDetails(appId, item);
});

// Append the fragment to the carousel at once
carousel.appendChild(fragment);

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

// Carousel Script
$('.slider').each(function() {
    var $this   = $(this);
    var $group  = $this.find('.slide-group');
    var $slides = $this.find('.slide-item')
    var buttonArray     = [];
    var currentIndex    = 0;
    var timeout;

    function move(newIndex) {           // Creates the slide from old to new one
        var animateLeft, slideLeft;     // Delcare variables

        advance();                      // When slide moves, call advance() again

        // If current slide is showing or a slide is naimating, then do nothing
        if ($group.is(':animated') || currentIndex === newIndex) {
            return;
        }

        buttonArray[currentIndex].removeClass('active');    // Remove class from item
        buttonArray[newIndex].addClass('active');           // Add class to new item

        if (newIndex > currentIndex) {  // If new item > current
            slideLeft = '100%';         // Sit the new slide to the right
            animateLeft = '100%';       // Animate the current group to the left
        } else {                        // Otherwise
            slideLeft = '-100%';        // Sit the new slide to the left
            animateLeft ='100%';        // Animate the current group to the right
        }
        // Position new slide to the left (if less) or right (if more) of current
        $slides.eq(newIndex).css( {left :slideLeft, display: 'block'} );
        $group.animate( {left: animateLeft} , function() {      // Animate slides and
            $slides.eq(currentIndex).css( {display: 'none'} );  // Hide previous slide
            $slides.eq(newIndex).css( {left: 0} );      // Set position of the new item
            $group.css( {left: 0} );                    // Set position of group of slides
            currentIndex = newIndex;                    // Set currentIndex to the new image
        });
    }

    function advance() {
        clearTimeout(timeout);
        // Start timer to run an anonymous function every 4 seconds
        timeout = setTimeout(function() {
            if (currentIndex < ($slides.length -1)) {   // If not the last slide
                $button.addClass('active');             // Add the active class
            } else {
                move(0);
            }
        }, 4000);    
    }

    $.each($slides, function(index) {
        // Create a button element for the button
        var $button = $('<button type="button" class="slide-btn">&bull;</button>');
        if (index === currentIndex) {           //if index is the current item
            $button.addClass('active');         // Add the active class
        }
        $button.on('click', function() {        // Create event handler for the button
            move(index);                        // It calls the move() function
        }).appendTo('.slide-buttons');              // Add to the buttons holder
        buttonArray.push($button);              // Add it to the button array
    });

    advance();          // Script is set up - call advance() to start timer

});