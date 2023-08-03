const API_WEATHER_KEY = 'JY5J7925JUA4SMZSFE9293BXE'
const API_WEATHER_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?'
const API_CITIES_KEY = '565816454eb44f05a8074d3e6a545669'
const API_CITIES_URL = 'https://api.geoapify.com/v1/geocode/autocomplete?text='

const App = () =>{
    let availableCities = []
    let weatherData = {}
    const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day:'numeric'}
    const searchInput = document.querySelector('.search-input')
    const searchDiv = document.querySelector('.search-autocomplete')

    //Fetch Weather
    const fetchWeather = async(city) =>{
        try{
            const response = await fetch(API_WEATHER_URL + `locations=${city}&aggregateHours=24&unitGroup=us&shortColumnNames=false&contentType=json&key=${API_WEATHER_KEY}`)
            const data = await response.json()
            weatherData = {...data.locations}
            
            //Set Data
            if (weatherData[Object.keys(weatherData)]){
                const title = document.querySelector('.location-details h2')
                if (Object.keys(weatherData)[0].length < 15){
                    // title.style.fontSize = `60px`
                    title.textContent = Object.keys(weatherData)
                } else {
                    // title.style.fontSize = `30px`
                    title.textContent = Object.keys(weatherData)
                }
                const date = new Date(weatherData[Object.keys(weatherData)].values[0].datetime)
                const temp = Math.floor((5/9) * (weatherData[Object.keys(weatherData)].values[0].temp - 32))
                const icon = weatherData[Object.keys(weatherData)].currentConditions.icon
                const cloudCover = Math.floor(weatherData[Object.keys(weatherData)].values[0].cloudcover)
                const humidity = Math.floor(weatherData[Object.keys(weatherData)].values[0].humidity)
                const wind = Math.floor(weatherData[Object.keys(weatherData)].values[0].wspd)
                const rain = weatherData[Object.keys(weatherData)].values[0].precip
                document.querySelector('.location-details p').textContent = date.toLocaleDateString('en-US', dateOptions)
                document.querySelector('.display h1').textContent = `${temp}\u00B0`
                document.querySelector('.display img').src = icon ? `assets/SVG/1st Set - Color/${icon}.svg` : document.querySelector('.display img').src
                document.querySelector('.background-img').src = icon ? `assets/JPG/${icon}.jpg` :  document.querySelector('.background-img').src
                document.querySelector('.detail-param-cloudy .val').textContent = `${cloudCover}%`
                document.querySelector('.detail-param-humidity .val').textContent = `${humidity}%`
                document.querySelector('.detail-param-wind .val').textContent = `${wind} km/h`
                document.querySelector('.detail-param-rain .val').textContent = `${rain} mm`
            }
        } catch(err) {
            console.error(err)
        }
    }
    fetchWeather('Warsaw')

    //Fetch Cities
    const fetchCities = async(url) =>{
        try{
            const response = await fetch(API_CITIES_URL + url)
            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }
            const data = await response.json()
            //Delete Previous Data
            while (searchDiv.firstChild) {
                searchDiv.removeChild(searchDiv.firstChild);
            }

            //Fetch New Data
            availableCities = [...new Set(data.features.map((city) =>{
                return city.properties.city
            }).filter(city => city !== undefined).slice(0,4))]
        } catch(err) {
            console.log(err)
        }
    }

    //Search city 
    searchInput.addEventListener('input', async function(event){

        //Search for Cities 
        const searchText = event.target.value;
        if(searchText.length > 0){
           await fetchCities(`${searchText}&apiKey=${API_CITIES_KEY}`)
        } else { 
            availableCities = []
        }
        
        //Autocomplete City
        availableCities.forEach((city, idx) => {
            const button = document.createElement('button')
            button.textContent = availableCities[idx]
            searchDiv.appendChild(button)
        })
        
        //Choose of City
        const cityBtns = document.querySelectorAll('.search-autocomplete button')
        cityBtns.forEach((btn) =>{
            btn.addEventListener('click', function(){
                const city = btn.textContent
                availableCities = []
                while (searchDiv.firstChild) {
                    searchDiv.removeChild(searchDiv.firstChild);
                }
                searchInput.value = ""
                fetchWeather(city)
            })
        })
    })
}

App()