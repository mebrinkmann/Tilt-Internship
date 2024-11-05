<?php

// Define API and data file paths
define("DATA_FILE", "data.json");
define("API_URL", "https://store.steampowered.com/api/appdetails/?appids=");

// Function to load game IDs from the JSON file
function loadGameIds() {
    if (!file_exists(DATA_FILE)) {
        die("Data file not found.");
    }

    // Read JSON file
    $data = json_decode(file_get_contents(DATA_FILE), true);
    if (!$data) {
        die("Failed to decode JSON data.");
    }
    return $data;
}

// Function to ping the API and retrieve game details
function fetchGameDetails($appId) {
    $url = API_URL . $appId;
    $response = file_get_contents($url);
    if (!$response) {
        echo "Failed to fetch data for game ID $appId\n";
        return null;
    }

    $gameData = json_decode($response, true);
    return $gameData[$appId]['data'] ?? null;
}

// Function to create carousel HTML for a game
function createCarouselSlide($appId, $gameData) {
    if (!$gameData || !$gameData['success']) {
        return "<div class='slide-item'><p>Details not available for Game ID $appId</p></div>";
    }

    $name = $gameData['name'];
    $description = $gameData['short_description'] ?? 'No description available.';
    $releaseDate = $gameData['release_date']['coming_soon'] ? 'Coming Soon' : $gameData['release_date']['date'];

    return "
    <div class='slide-item' id='slide-{$appId}'>
        <img src='https://cdn.cloudflare.steamstatic.com/steam/apps/{$appId}/capsule_231x87.jpg' alt='{$name}' loading='lazy'>
        <div class='carousel-info'>
            <h4>{$name}</h4>
            <p>{$description} - {$releaseDate}</p>
            <a href='https://store.steampowered.com/app/{$appId}/?curator_clanid=44087493' target='_blank' class='btn'>View on Steam</a>
        </div>
    </div>
    ";
}

// Function to refresh data every 10 minutes on Sundays
function refreshCarouselSlides() {
    $data = loadGameIds();

    $carouselData = [];
    foreach ($data as $category => $appIds) {
        $carouselData[$category] = [];
        foreach ($appIds as $appId) {
            $gameData = fetchGameDetails($appId);
            $carouselSlide = createCarouselSlide($appId, $gameData);
            $carouselData[$category][] = $carouselSlide;
        }
    }

    // Save the generated carousel HTML to a JSON file
    file_put_contents("carousel_slides.json", json_encode($carouselData));
}

// Run every 10 minutes on Sundays
if (/*date('w') == 0 && */(time() % 600) < 60) { // 0 = Sunday
    refreshCarouselSlides();
}

?>
