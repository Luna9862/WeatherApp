document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const zipCode = document.getElementById('zipCode').value.trim();
    const apiKey = 'f9779fa906163f8ffcaca6ae82a2a026'; // Wrap your API key in quotes

    // First fetch to get latitude and longitude based on zip code
    const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the data to see the structure

            if (data && data.lat && data.lon) {
                const { lat, lon } = data;

                // Second fetch to get weather data based on latitude and longitude
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

                return fetch(weatherUrl);
            } else {
                throw new Error('Latitude and longitude not found.');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data request failed');
            }
            return response.json();
        })
        .then(weatherData => {
            console.log(weatherData); // Log the weather data to see the structure

            // Update weather information display
            const weatherInfo = document.getElementById('weatherInfo');
            weatherInfo.innerHTML = `
                <h2>Weather in ${weatherData.name}</h2>
                <p><strong>Current Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Current Temperature:</strong> ${weatherData.main.temp}&deg;F</p>
                <p><strong>Current Conditions:</strong> ${weatherData.weather[0].description}</p>
                <p><strong>High / Low Temperature:</strong> ${weatherData.main.temp_max}&deg;F / ${weatherData.main.temp_min}&deg;F</p>
            `;

            // Call updateBackground with lowercase weather condition
            updateBackground(weatherData.weather[0].main.toLowerCase());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const weatherInfo = document.getElementById('weatherInfo');
            weatherInfo.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
        });
});

function updateBackground(weatherCondition) {
    const container = document.querySelector('.container');

    // Remove existing background classes
    container.classList.remove('sunny-bg', 'rainy-bg', 'cloudy-bg', 'default-bg');

    // Add corresponding background class based on weather condition
    switch (weatherCondition) {
        case 'clear':
            container.classList.add('sunny-bg');
            break;
        case 'clouds':
        case 'few clouds':
            container.classList.add('cloudy-bg');
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            container.classList.add('rainy-bg');
            break;
        default:
            // For any other weather condition, set a default background
            container.classList.add('default-bg');
    }
}
