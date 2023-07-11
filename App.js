const API_WEATHER_KEY = 'JY5J7925JUA4SMZSFE9293BXE'
const API_WEATHER_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?'
const API_CITIES_KEY = '565816454eb44f05a8074d3e6a545669'
const API_CITIES_URL = 'https://api.geoapify.com/v1/geocode/autocomplete?text='

const App = () =>{
    let availableCities = [];
    const searchInput = document.querySelector('.search-input')
    const searchDiv = document.querySelector('.search-autocomplete')

    //Fetch Weather
    const fetchWeather = async(url) =>{
        try{
            const response = await fetch(API_WEATHER_URL + url)
            const data = await response.json()
        } catch(err) {
            console.error(err)
        }
    }

    //Fetch Cities
    const fetchCities = async(url) =>{
        try{
            const response = await fetch(API_CITIES_URL + url)
            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }
            const data = await response.json()
            availableCities = [...new Set(data.features.map((city) =>{
                return city.properties.city
            }).filter(city => city !== undefined).slice(0,4))]
        } catch(err) {
            console.log(err)
        }
    }

    //Search city 
    searchInput.addEventListener('input', function(event){
        //Clear the buttons
        while (searchDiv.firstChild) {
            searchDiv.removeChild(searchDiv.firstChild);
        }

        //Search for Weather and Cities 
        const searchText = event.target.value;
        fetchWeather(`locations=${searchText}&aggregateHours=24&unitGroup=us&shortColumnNames=false&contentType=json&key=${API_WEATHER_KEY}`)
        if(searchText.length > 0){
            fetchCities(`${searchText}&apiKey=${API_CITIES_KEY}`)
        } else { 
            availableCities = []
        }
        
        //Autocomplete City
        availableCities.forEach((city, idx) => {
            const button = document.createElement('button')
            button.textContent = availableCities[idx]
            searchDiv.appendChild(button)
        })
    })
}

App()