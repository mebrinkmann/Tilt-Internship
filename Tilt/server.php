<?php
// Read data from the JSON file
$jsonFile = 'data.json';
if (!file_exists($jsonFile)) {
    die('JSON file not found');
}

$data = json_decode(file_get_contents($jsonFile), true);

// Initialize an empty array to store HTML for slides
$carouselData = '';

// Function to fetch game details from the Steam API
function fetchGameDetails($appId) {
    $url = "https://store.steampowered.com/api/appdetails/?appids=$appId";
    $response = @file_get_contents($url); // Suppress errors
    if ($response === false) {
        error_log("Error fetching data for appId: $appId");
        return null;
    }

    $gameData = json_decode($response, true);

    if (isset($gameData[$appId]['data']) && $gameData[$appId]['success']) {
        $gameDetails = $gameData[$appId]['data'];
        return [
            'name' => $gameDetails['name'],
            'short_description' => $gameDetails['short_description'] ?? 'No description available.',
            'release_date' => $gameDetails['release_date']['coming_soon'] ? 'Coming Soon' : $gameDetails['release_date']['date'],
            'image' => "https://cdn.cloudflare.steamstatic.com/steam/apps/$appId/capsule_231x87.jpg",
            'url' => "https://store.steampowered.com/app/$appId"
        ];
    }
    return null;
}



// Function to generate carousel slides for a given category of games
function generateCarouselSlides($category, $gameIds) {
    global $carouselData;

    foreach ($gameIds as $index => $appId) {
        $gameDetails = fetchGameDetails($appId);
        if ($gameDetails) {
            $carouselData .= "
            <div class='slide-item'>
                <img src='{$gameDetails['image']}' alt='Game {$appId}' loading='lazy'>
                <div class='carousel-info'>
                    <h4>{$gameDetails['name']}</h4>
                    <p>{$gameDetails['short_description']} - {$gameDetails['release_date']}</p>
                    <a href='{$gameDetails['url']}' target='_blank' class='btn'>View on Steam</a>
                </div>
            </div>";
        } else {
            $carouselData .= "
            <div class='slide-item'>
                <h4>Game not found</h4>
                <p>Details not available</p>
            </div>";
        }
    }
}

// Generate the carousel slides for each category
generateCarouselSlides('topUnreleasedIndieGamesThisWeek', $data['topUnreleasedIndieGamesThisWeek']);
generateCarouselSlides('trendingUnreleasedIndieGamesThisWeek', $data['trendingUnreleasedIndieGamesThisWeek']);
generateCarouselSlides('featuredUnreleasedIndieGames', $data['featuredUnreleasedIndieGames']);
generateCarouselSlides('trendingFreeIndieGames', $data['trendingFreeIndieGames']);
generateCarouselSlides('trendingIndieGamesOnSale', $data['trendingIndieGamesOnSale']);
generateCarouselSlides('trendingIndieGamesFullPrice', $data['trendingIndieGamesFullPrice']);

// Save the generated HTML into a file
file_put_contents('carousel_data.html', $carouselData);

// Return the HTML for the carousel to be used in the frontend
echo $carouselData;
?>
