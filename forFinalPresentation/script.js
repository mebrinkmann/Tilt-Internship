$('.carousel').each(function() {
    const $this = $(this);
    const $group = $this.find('.slide-group');
    const $slides = $this.find('.slide-item');
    const buttonArray = [];
    const maxButtons = 5; // Set maximum number of buttons
    let currentIndex = 0;
    let timeout;

    function move(newIndex) {
        if ($group.is(':animated') || currentIndex === newIndex) {
            return;
        }
        
        // Update buttons
        buttonArray[currentIndex].removeClass('active');
        buttonArray[newIndex].addClass('active');
        
        // Slide animation logic
        const slideLeft = newIndex > currentIndex ? '100%' : '-100%';
        const animateLeft = newIndex > currentIndex ? '-100%' : '100%';
        
        $slides.eq(newIndex).css({ left: slideLeft, display: 'block' });
        $group.animate({ left: animateLeft }, function() {
            $slides.eq(currentIndex).hide();
            $slides.eq(newIndex).css({ left: 0 });
            $group.css({ left: 0 });
            currentIndex = newIndex;
        });

        advance();
    }

    function advance() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            move(currentIndex < $slides.length - 1 ? currentIndex + 1 : 0);
        }, 4000);
    }

    // Create buttons with max limit
    $slides.each((index, slide) => {
        if (index >= maxButtons) return; // Skip creating more buttons if max reached

        const $button = $('<button type="button" class="slide-btn">&bull;</button>');
        $button.on('click', () => move(index)).appendTo($this.find('.slide-buttons'));
        if (index === currentIndex) $button.addClass('active');
        
        buttonArray.push($button);
    });

    advance();
});
