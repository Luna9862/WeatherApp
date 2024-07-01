document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    // Prevent default form submission
   //The code above attaches an event listener to the form with id `weatherForm`
   //When the form is submitted by pressing enter or clicking the button, this function is triggered.
    const zipCode = document.getElementById('zipCode').value.trim();
    const apiKey = 'f9779fa906163f8ffcaca6ae82a2a026'; // Wrap your API key in quotes
//created variables zipCode and apiKey. zipCode: gets the value from the input field. The apikey contains the API key for accessing the OpenWeatherMap APIs.
    // First fetch to get latitude and longitude based on zip code
    const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`;
//the geoURl variable contains the URL to fetch georgraphic location data based on the zip code. 
//First fecth to get the latitude and longitude based on zipcode 
    fetch(geoUrl) //fetch is used to make an http request to the openweathermap geo API to retreive geograph data based on zip code. 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the data to see the structure
            //handle latitue and longtidue data 
            //checks whether the variable data exisits and contains properties lat and lon. 
            //acts as a safegaurd so that it is executed when the necessary geographic coordinates successfull obtained from the intial API call (geoURl) 
            if (data && data.lat && data.lon) { //
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
        //catches and logs errors if fetching data fails, updating weatherinfo to inform the user. 
        .catch(error => {
            console.error('Error fetching data:', error);
            const weatherInfo = document.getElementById('weatherInfo');
            weatherInfo.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
        });
});

function updateBackground(weatherCondition) { //upates the background of the element "container," based on the weather conditions passed as weatherCondition. 
    const container = document.querySelector('.container');

    // Remove existing background classes from the container.
    container.classList.remove('sunny-bg', 'rainy-bg', 'cloudy-bg', 'default-bg');

    // using the switch add corresponding background class to the container based on weather condition
    switch (weatherCondition) {//case means any possible value of WeatherCondition
        case 'clear'://if the weather condition equals clear, the image is added to the container
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
