const cityInput= document.getElementById('city-input');
const searchBtn= document.getElementById('search-button');
const currentWeather= document.getElementById('current-weather');
const daysForecast= document.getElementById('days-forecast');

const API_KEY = 'd0f77b2063c7222a29bb9cdaf5940117'; 

// ========== FUNGSI 1: Fetch Geo & Mulai Fetch Cuaca ==========
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;

    const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  
    fetch(GEO_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];

            // Ambil current dan forecast weather
            getCurrentWeather(name, lat, lon);
            getForecastWeather(name, lat, lon);
        })
        .catch(() => alert("Error fetching coordinates."));
};

searchBtn.addEventListener('click', ()=> {
    const cityName= cityInput.value.trim();
        if(cityName){
            getCityCoordinates(cityName)
        } else {
            alert(" Lokasi Kota tidak boleh kosong..!")
        }
        cityInput.value= '';
});
cityInput.addEventListener('keydown', (e)=> {
    if(e.key === "Enter") searchBtn.click()
})

const weatherMap= {
    Clear: { text: "Cerah", icon: "assets/clear.png"},
    Clouds: { text: "Berawan", icon: "assets/clouds.png"},
    Rain: { text: "Hujan", icon: "assets/rain.png"},
    Drizzle: { text: "Hujan Gerimis", icon: "assets/drizzle.png"},
    Thunderstorm: { text: "Badai Petir", icon: "assets/thunder.png"},
    Mist: {text: "Berkabut", icon: "assets/mist.png"},
    Haze: {text: "Berkabut", icon: "assets/mist.png"},
    Default: { text: "Unknown", icon: "assets/unknown.png"}
}

function convertDT(dateString){
    const date= new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}    

// ========== FUNGSI 2: Fetch Current Weather ==========
const getCurrentWeather = (cityName, lat, lon) => {
    const CURRENT_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(CURRENT_URL)
        .then(res => res.json())
        .then(data => {
            const mainWeather= data.weather[0].main;
            const weatherInfo= weatherMap[mainWeather] || weatherMap.Default;
            const weatherCard= `
                <div class="d-flex bg-primary rounded p-2 text-white justify-content-between align-items-center">
                    <div>
                        <h4 class="fw-bold"> City of ${cityName} (now)</h4>
                        <h6 class="my-3 mt-3">Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C </h6>
                        <h6 class="my-3">Wind: ${data.wind.speed} M/S</h6>
                        <h6 class="my-3">Humidity: ${data.main.humidity}%</h6>
                    </div>
                    <div class="text-center me-lg-3">
                        <img class="img-fluid w-50" src="${weatherInfo.icon}" alt="weather-icon"/>
                        <h6>${weatherInfo.text}</h6>
                    </div>
                </div>
                `
            currentWeather.innerHTML = weatherCard;
        })
        .catch(() => alert("Error fetching current weather."));
};

// ========== FUNGSI 3: Fetch Forecast Weather ==========
const getForecastWeather = (cityName, lat, lon) => {
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(FORECAST_URL)
        .then(res => res.json())
        .then(data => {
            const forecastArray = data.list;
            const uniqueDays = new Set();

            const today= new Date().toISOString().split('T')[0];

            const filteredForecast = forecastArray.filter(item => {
                const date = item.dt_txt.split(" ")[0];
                if (date!== today&& !uniqueDays.has(date) && uniqueDays.size < 4) {
                    uniqueDays.add(date);
                    return true;
                }
                return false;
            });
            daysForecast.innerHTML= '';
            filteredForecast.forEach(item => {
                const mainWeather= item.weather[0].main;
                const weatherInfo= weatherMap[mainWeather] || weatherMap.Default;
                const card = `
                     <div class="col mb-3">
                        <div class="card border-0 bg-primary text-center text-white">
                            <div class="card-body p-3>
                                <h1 class="display-5">
                                    ${convertDT(item.dt_txt)}
                                </h1>
                                <div class="text-center me-lg-3">
                                    <img class="img-fluid w-25" src="${weatherInfo.icon}" alt="weather-icon"/>
                                    <h6>${weatherInfo.text}</h6>
                                </div>
                                <h6 class="card-text my-3 mt-3">
                                    Temp: ${(item.main.temp - 273.15).toFixed(2)}°C
                                </h6>
                                <h6 class="card-text my-3">
                                    Wind: ${item.wind.speed} M/S
                                </h6>
                                <h6 class="card-text my-3">
                                    Humidity: ${item.main.humidity}%
                                </h6>
                            </div>
                        </div>
                    </div>
                `;
                daysForecast.insertAdjacentHTML("beforeend", card);
            });
        })
        .catch((err) => {
            console.error(err);
            alert("Error fetching forecast weather.");   
        })
};

    

   
 
