document.addEventListener('DOMContentLoaded', () => {
    // Fetch and inject HTML into the carousel containers
    function fetchCarouselData() {
        fetch('server.php')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                injectCarouselData(doc); // Pass parsed HTML for injection
                console.log('Carousel data updated successfully.');
            })
            .catch(error => {
                console.error('Error fetching carousel data:', error);
            });
    }

    function injectCarouselData(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
    
        const categories = [
            'topUnreleasedIndieGamesThisWeek',
            'trendingUnreleasedIndieGamesThisWeek',
            'featuredUnreleasedIndieGames',
            'trendingFreeIndieGames',
            'trendingIndieGamesOnSale',
            'trendingIndieGamesFullPrice'
        ];
    
        categories.forEach(category => {
            const categoryDiv = tempDiv.querySelector(`#${category}`);
            const carouselContainer = document.getElementById(category);
            if (carouselContainer && categoryDiv) {
                carouselContainer.querySelector('.slide-group').innerHTML = categoryDiv.innerHTML;
            }
        });
    }    

    fetchCarouselData();

    // Set up periodic request every 10 minutes
    setInterval(fetchCarouselData, 600000);
});

// Function to populate the carousels with game data
function populateCarousel(carouselId, games) {
    const carousel = document.getElementById(carouselId).querySelector('.slide-group');
    if (!carousel || !games || games.length === 0) return;

    const fragment = document.createDocumentFragment();

    games.forEach((game, index) => {
        const slideItem = document.createElement('div');
        slideItem.classList.add('slide-item');
        slideItem.id = `slide-${index}`;

        slideItem.innerHTML = `
            <img src="${game.image_url}" alt="Game ${game.id}" loading="lazy">
            <div class="carousel-info">
                <h4>${game.name}</h4>
                <p>${game.description}</p>
                <p>${game.release_date}</p>
                <a href="https://store.steampowered.com/app/${game.id}/" target="_blank" class="btn">View on Steam</a>
            </div>
        `;
        
        fragment.appendChild(slideItem);
    });

    // Append the fragment to the carousel at once
    carousel.appendChild(fragment);
}

// Carousel Script
$('.carousel').each(function() {
    var $this   = $(this);
    var $group  = $this.find('.slide-group');
    var $slides = $this.find('.slide-item')
    var buttonArray     = [];
    var currentIndex    = 0;
    var timeout;

    function move(newIndex) {           // Creates the slide from old to new one
        var animateLeft, slideLeft;     // Declare variables

        advance();                      // When slide moves, call advance() again

        // If current slide is showing or a slide is animating, then do nothing
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
        $slides.eq(newIndex).css({left: slideLeft, display: 'block'});
        $group.animate({left: animateLeft}, function() {
            $slides.eq(currentIndex).css({display: 'none'});  // Hide previous slide
            $slides.eq(newIndex).css({left: 0});      // Set position of the new item
            $group.css({left: 0});                    // Set position of group of slides
            currentIndex = newIndex;                    // Set currentIndex to the new image
        });
    }

    function advance() {
        clearTimeout(timeout);
        // Start timer to run an anonymous function every 4 seconds
        timeout = setTimeout(function() {
            if (currentIndex < ($slides.length - 1)) {   // If not the last slide
                $button.addClass('active');             // Add the active class
            } else {
                move(0);
            }
        }, 4000);
    }

    $.each($slides, function(index) {
        // Create a button element for the button
        var $button = $('<button type="button" class="slide-btn">&bull;</button>');
        if (index === currentIndex) {           // If index is the current item
            $button.addClass('active');         // Add the active class
        }
        $button.on('click', function() {        // Create event handler for the button
            move(index);                        // It calls the move() function
        }).appendTo('.slide-buttons');              // Add to the buttons holder
        buttonArray.push($button);              // Add it to the button array
    });

    advance();          // Script is set up - call advance() to start timer

});