const OPEN_WEATHER_API_KEY = `61bcbac336985ddd3e30d1611fa306b3`
let LOCATION = document.querySelector(`.search-wrapper input`).value
const DEGREE_90 = 90
const DEGREE_270 = 270
const forecastHours = 12
const forecastDays = 10
// Units
let temperatureUnit = `°C`

let lockClick = true
let isDayModeActive = true
let isAutoModeActive = false
let isNightModeActive = false
let currentDegree = 0

// data objects
let weatherData = {
    temperature: 0,
    feelsLike: 0,
    humidity: 0,
    pressure: 0,
    description: "",
    cord: {
        lat: 0,
        lon: 0,
    },
    sunriseSunset: {
        sunriseTime: 0,
        sunsetTime: 0,
        sunriseHour: 0,
        sunsetHour: 0,
    },
    visibility: 0,
    windSpeed: 0,
    windDegree: 0,
    time: {
        lastUpdatedTime: 0,
        timezone: 0,
        currentTime: 0,
        currentHour: 0,
    },
}
let hourlyData = []

// renderPerHour Variables
let sunriseSunsetAdd = false

// map Variables
let weatherMap = null
let locationMarker = null

// search variables
const searchInputField = document.querySelector('.search-wrapper input');
const searchButtonElement = document.getElementById(`search-button`)
const searchSuggestionsContainer = document.getElementById('suggestions-container');

// search and suggestions render functios
const searchCityName = () => {
    searchSuggestionsContainer.innerHTML = ''
    const searchInputValue = searchInputField.value.trim()
    if (searchInputValue) {
        LOCATION = searchInputValue
        fetchWeatherData()
    }
}

const fetchSearchSuggestions = async (searchTerm) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${searchTerm}&appid=${OPEN_WEATHER_API_KEY}`)
    const data = await response.json()
    if (data.list) {
        return data.list.map(item => item.name)
    }
    return []
}

const handleInput = async () => {
    const searchTerm = searchInputField.value.trim()
    if (!searchTerm) {
        searchSuggestionsContainer.innerHTML = ''
        return
    }
    const suggestions = await fetchSearchSuggestions(searchTerm)
    renderSuggestions(suggestions)
}

const renderSuggestions = (suggestions) => {
    searchSuggestionsContainer.innerHTML = ''

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div')
        suggestionElement.className = "suggestion-item"
        suggestionElement.classList.add('suggestion-item')
        suggestionElement.innerText = suggestion

        suggestionElement.addEventListener('click', () => {
            searchInputField.value = suggestion
            LOCATION = suggestion
            searchSuggestionsContainer.innerHTML = ''
            fetchWeatherData()
        })
        searchSuggestionsContainer.appendChild(suggestionElement)
    })
}

// fetch main data functions
const fetchData = async (url) => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}

const fetchWeatherData = async () => {
    const currentWeatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${OPEN_WEATHER_API_KEY}`
    const hourlyForecastAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${LOCATION}&cnt=${forecastHours}&appid=${OPEN_WEATHER_API_KEY}`

    try {
        const [currentWeatherData, hourlyForecastData] = await Promise.all([
            fetchData(currentWeatherAPIUrl),
            fetchData(hourlyForecastAPIUrl)
        ])

        if (currentWeatherData && hourlyForecastData) {
            const { visibility, weather, timezone, dt, main, wind, sys, coord } = currentWeatherData
            const { speed: windSpeed, deg: windDegree } = wind
            const { feels_like: feelsLike, humidity, temp: temperature, pressure } = main
            const { sunrise: sunriseUnixTimestamp, sunset: sunsetUnixTimestamp } = sys
            const { lat, lon } = coord
            
            weatherData = {
                temperature: Math.floor(temperature) - 273,
                feelsLike: Math.floor(feelsLike) - 273,
                humidity,
                pressure,
                visibility,
                description: weather[0].description,
                cord: { lat, lon },
                sunriseSunset: {
                    sunriseTime: formatUnixTimestampToTime(sunriseUnixTimestamp),
                    sunsetTime: formatUnixTimestampToTime(sunsetUnixTimestamp),
                    sunriseHour: parseInt(formatUnixTimestampToTime(sunriseUnixTimestamp).substring(0, 2)) + 0.1,
                    sunsetHour: parseInt(formatUnixTimestampToTime(sunsetUnixTimestamp).substring(0, 2)) + 0.1,
                },
                windSpeed,
                windDegree,
                time: {
                    timezone,
                    lastUpdatedTime: formatUnixTimestampToTime(dt),
                    currentTime: formatUnixTimestampToTime(new Date().getTime() / 1000),
                    currentHour: 0
                },
            }
           
            weatherData.time.currentTime = formatUnixTimestampToTime(new Date().getTime() / 1000)
            weatherData.time.currentHour = weatherData.time.currentTime.slice(0, 2)
            weatherData.time.lastUpdatedTime = formatUnixTimestampToTime(dt)
            weatherData.sunriseSunset.sunriseTime = formatUnixTimestampToTime(sunriseUnixTimestamp)
            weatherData.sunriseSunset.sunsetTime = formatUnixTimestampToTime(sunsetUnixTimestamp)
            weatherData.sunriseSunset.sunriseHour = parseInt(formatUnixTimestampToTime(sunriseUnixTimestamp).substring(0, 2)) + 0.1
            weatherData.sunriseSunset.sunsetHour = parseInt(formatUnixTimestampToTime(sunsetUnixTimestamp).substring(0, 2)) + 0.1

            hourlyData = hourlyForecastData.list.map(e => ({
                hourOfDayInUTS0: parseInt(e.dt_txt.slice(11, 13)),
                description: e.weather[0].description,
                temperature: Math.floor(e.main.temp) - 273,
                pop: e.pop,
            }))

    
            renderMain()
            renderDailyInfoContainer()
            renderPerHourInfoContainer()
            updateMapLocation(lat, lon)
            if (!weatherMap) {
                initMap(weatherData.cord.lat, weatherData.cord.lon)
            }
            checkMoonSunMode()
            changeTemperatureUnit()
            eventListenersAdd()
        }
    } catch (error) {
        console.error("Error fetching weather data:", error)
    }
}

const checkMoonSunMode = () => {
    if(isDayModeActive){
        rotateOrbit(DEGREE_90)
        isDayModeActive = true
        isAutoModeActive = false
        isNightModeActive = false
    }else if(isAutoModeActive){
        rotateOrbit(getAutoModeDegree())
        isDayModeActive = false
        isAutoModeActive = true
        isNightModeActive = false
    }else {
        rotateOrbit(DEGREE_270)
        isDayModeActive = false
        isAutoModeActive = false
        isNightModeActive = true
    }
}

// render functions
const renderMain = () => {
    const { time, description, feelsLike, temperature, humidity, windSpeed, sunriseSunset, visibility, pressure, windDegree } = weatherData
    const { lastUpdatedTime, currentTime } = time
    const temperatureValue = document.getElementById(`main-degree`)
    const mainLocationValue = document.getElementById(`city-name`)
    const mainFeelsLikeValue = document.getElementById(`feels-like-degree`)
    const lastUpdateTimeValue = document.getElementById(`last-update-time`)
    const timeNowValue = document.getElementById(`time-now`)
    
    const humidityValue = document.getElementById(`humidity-value`)
    const windSpeedValue = document.getElementById(`wind-speed`)
    const sunriseTimeValue = document.querySelector(`.sunrise p`)
    const sunsetTimeValue = document.querySelector(`.sunset p`)
    
    const visibilityElement = document.querySelector(`#visibility p`)
    const pressureElement = document.querySelector(`#pressure p`)
    const windDegreeElement = document.querySelector(`#wind-degree p`)
    
    const weatherIcon = document.querySelector(`.weather-description-img img`)
    
    temperatureValue.innerText = `${checkTemperature(temperature)}`
    mainLocationValue.innerText = `${LOCATION.toUpperCase()}`
    mainFeelsLikeValue.innerText = `${checkTemperature(feelsLike)}`
    lastUpdateTimeValue.innerText = lastUpdatedTime
    timeNowValue.innerText = currentTime
    
    humidityValue.innerText = `${humidity}`
    windSpeedValue.innerText = `${windSpeed}`
    sunriseTimeValue.innerText = `${sunriseSunset.sunriseTime}`
    sunsetTimeValue.innerText = `${sunriseSunset.sunsetTime}`
    
    visibilityElement.innerText = `${getVisibilityValue(visibility)}`
    pressureElement.innerText = `${pressure}hPa`
    windDegreeElement.innerText = `${windDegree}deg`

    weatherIcon.src = `assets/icons/svg_weathor_icon_color/${getImage(description, currentTime)}`
}

const renderPerHourInfoContainer = () => {
    const parentElement = document.querySelector(`.per-hour-info-container`)
    deleteAllPrevDiv(`hour-info`)
    const { sunriseSunset } = weatherData
    sunriseSunsetAdd = false
   
    for (let i = 0; i < forecastHours; i++) {
        const { hourOfDayInUTS0, description, temperature, pop } = hourlyData[i]
        let hourInfoDiv = document.createElement(`div`)
        hourInfoDiv.className = `hour-info`

        let timeFrom = parseInt(getLocalTimeInFormattedString(hourOfDayInUTS0).slice(0,2))-3
        let timeTo = parseInt(getLocalTimeInFormattedString(hourlyData[i].hourOfDayInUTS0).slice(0,2))
        if(timeFrom === 0) timeFrom = 24

         if(sunriseSunsetAdd && timeFrom < sunriseSunset.sunriseHour && timeTo > sunriseSunset.sunriseHour){
            sunriseSunsetAdd = false
            hourInfoDiv.innerHTML = `
            <h4 id="hour">${sunriseSunset.sunriseTime}</h4>
            <img id="hour-weather-img" src="assets/icons/sunset-sunrise/sunrise-light_large.png" alt="hour-img">
            </div>`
            i--
        } 
        else if(sunriseSunsetAdd && timeFrom < sunriseSunset.sunsetHour && timeTo > sunriseSunset.sunsetHour){
            sunriseSunsetAdd = false
            hourInfoDiv.innerHTML = `
            <h4 id="hour">${sunriseSunset.sunsetTime}</h4>
            <img id="hour-weather-img" src="assets/icons/sunset-sunrise/sunset-light_large.png" alt="hour-img">
            </div>` 
            i--
        } 
        else{
            sunriseSunsetAdd = true
            const hourOfDayInUTS0String = getLocalTimeInFormattedString(hourOfDayInUTS0)
            hourInfoDiv.innerHTML = `
            <h4 id="hour">${hourOfDayInUTS0String}</h4>
            <img id="hour-weather-img" src="assets/icons/svg_weathor_icon_color/${getImage(description,hourOfDayInUTS0String)}" alt="hour-img">
            <h4><span class="temperature-value">${checkTemperature(temperature)}</span><span class="temperature-scale">°C</span></h4>
            <div id="hour-rain-index">
            <img src="assets/icons/rain.png" alt="">
            <p id="hour-rain-index">${Math.floor(pop * 100)}%</p>
            </div>`
        }
        
        parentElement.append(hourInfoDiv)
    }
}

const renderDailyInfoContainer = () => {
    deleteAllPrevDiv(`every-day-info`)
    const everyDayInfoDivParent = document.querySelector(`.daily-info-container-section`)
    for (let i = 0; i < 10; i++) {
        const everyDayInfoDiv = document.createElement(`div`)
        everyDayInfoDiv.className = `every-day-info`
        everyDayInfoDiv.innerHTML = `
        <div id="everyDay-name">
        <p>Today</p>
        </div>
        <div class="everyDay-day-night-images">
        <img id="day-img" src="assets/icons/404.png" alt="day">
        <img id="night-img" src="assets/icons/404.png" alt="night">
        </div>
        <div class="everyDay-rain-index">
        <img src="assets/icons/rain.png" alt="">
        <p>0%</p>
        </div>
        <div class="everyDay-degrees">
        <p><span id="day-degree">0</span><span class="temperature-scale">°C</span></p>
        <p><span id="night-degree">0</span><span class="temperature-scale">°C</span></p>
        </div>`
        everyDayInfoDivParent.append(everyDayInfoDiv)
    }    
}

// map functions
const initMap = (lat, lon) => {

    weatherMap = L.map('map').setView([lat, lon], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(weatherMap)

    locationMarker = L.marker([lat, lon]).addTo(weatherMap)
        .bindPopup('Текущее местоположение')
}

const updateMapLocation = (lat, lon) => {
    if (weatherMap && locationMarker) {
        weatherMap.setView([lat, lon], 13)
        locationMarker.setLatLng([lat, lon])
    }
}

// get value functions
const getVisibilityValue = (visibilityValue) => {
    let value = ``
    if (visibilityValue <= 1000) value = `bad`
    else if (visibilityValue > 1000 && visibilityValue < 10000) value = `medium`
    else value = `good`
    return value
}

const dayOrNight = `night`

const getImage = (description, time) => {
    const value = description.toLowerCase()
    switch (value) {
        case `clear sky`:
            return `clear_${checkForDayOrNight(time)}.svg`
        case `few clouds`:
            return `mostly_clear_${checkForDayOrNight(time)}.svg`
        case `scattered clouds`:
            return `partly_cloudy_${checkForDayOrNight(time)}.svg`
        case `broken clouds`:
            return `mostly_cloudy.svg`
        case `overcast clouds`:
            return `cloudy.svg`
        case `light rain`:
            return `rain_light.svg`
        case `moderate rain`:
            return `rain.svg`
        case `heavy rain`:
            return `rain_heavy.svg`
        case `light snow`:
            return `snow_light.svg`
        case `heavy snow`:
            return `snow_heavy.svg`
        default:
            return `404.png`
    }
}

// get Time functions
const getLocalTimeInFormattedString = (num) => {
    const { time } = weatherData
    const timezoneInHour = time.timezone / 60 / 60
    let sum = num + timezoneInHour
    let res = 0
    if (timezoneInHour >= 0) {
        if (sum >= 24) {
            res = sum - 24
        }
        else res = sum
    } else {
        if (sum < 0) {
            res = sum + 24
        }
        else res = sum
    }
    return `${res < 10 ? `0${res}` : `${res}`}:00`
}

const formatUnixTimestampToTime = (UnixTimestamp) => {
    const { time } = weatherData
    const { timezone } = time
    const timezoneOffsetInMilliseconds = (new Date().getTimezoneOffset()) * 60 * 1000
    const timezoneOffset = timezone * 1000
    const localTimestamp = UnixTimestamp * 1000 + timezoneOffsetInMilliseconds + timezoneOffset
    return formatToHourMinute(localTimestamp)
}

const formatToHourMinute = (UnixTimestamp) => {
    const date = new Date(UnixTimestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
}

// night mode
const rotateOrbit = (targetDegree) => {
    const sunMoonOrbit = document.getElementById('sun-moon-orbit')
    const moon = document.querySelector('.moon')
    const { sunriseSunset } = weatherData
    const sunriseSunsetDifference = sunriseSunset.sunsetHour - sunriseSunset.sunriseHour
    let addDegree = false
    lockClick = true

    const calculateRotationStep = () => {
        if ( currentDegree >= 0 && currentDegree < 180 || currentDegree >= 360 && currentDegree < 540 ) {
            changeBg(currentDegree)
            return (180 / sunriseSunsetDifference) / 2
        } else {
            changeBg(currentDegree)
            return (180 / (24 - sunriseSunsetDifference)) /2
        }
    }

    const changeBg = (currentDegree) => {
        const wrapper = document.querySelector(`.wrapper`)
        if ( currentDegree >= 0 && currentDegree < 180 || currentDegree >= 360 && currentDegree < 540 ) {
            wrapper.style = `background: #89b6e7`
        } else {
            wrapper.style = `background: #1a2e44`
        }
    }

    const check = () => {
        if(currentDegree >= targetDegree){
            if(addDegree){
                currentDegree = currentDegree - 360
                addDegree = false
            }
            return false
        }else {
            return true
        }
    }
    let stopAnimation = false
    const animateOrbit = () => {
        const rotationStep = calculateRotationStep()
        
        if(check()){
            if(stopAnimation){
                lockClick = false
                return
            }
            currentDegree += rotationStep
            if ( currentDegree > targetDegree - 10 && currentDegree < targetDegree + 10){
                currentDegree = targetDegree
                stopAnimation = true
            }
            sunMoonOrbit.style.transform = `translate(-50%, -50%) rotate(${currentDegree}deg)`
            moon.style.transform = `translate(0, -50%) rotate(-${currentDegree}deg)`
            setTimeout(() => {
                requestAnimationFrame(animateOrbit)
            },100)
        } else {
            lockClick = false
            return
        }
    }

    const howDegreeToRotate = () => {
        if ( targetDegree === currentDegree ) {
            lockClick = false
            return
        } else if ( targetDegree < currentDegree ) {
            targetDegree = 360 + targetDegree
            addDegree = true
        } else {
            targetDegree = targetDegree
            addDegree = false
        }
        requestAnimationFrame(animateOrbit)
    }
    howDegreeToRotate()
}


//change temperature
const changeTemperatureUnit = () => {
    const temperatureUnits = document.querySelectorAll(`.temperature-scale`)
    temperatureUnits.forEach(unit => {
        unit.innerText = temperatureUnit
    })
}

const updateTemperatureValues = () => {
    const temperaturedegrees = document.querySelectorAll('.temperature-value')
    temperaturedegrees.forEach(temperatureDegreeNumber => {
        if(temperatureUnit === ' F'){
            temperatureDegreeNumber.innerText = +temperatureDegreeNumber.textContent + 273
        }else if(temperatureUnit === '°C') {
            temperatureDegreeNumber.innerText = +temperatureDegreeNumber.textContent - 273
        }
        changeTemperatureUnit()
    })
}

const checkTemperature = (tempDegreeNumber) => {
    if(temperatureUnit === ' F'){
        return tempDegreeNumber + 273
    }else if(temperatureUnit === '°C') {
        return tempDegreeNumber
    }
}

// add event listeners
const eventListenersAdd = () =>{
    searchInputField.addEventListener('input', handleInput)
    searchButtonElement.addEventListener(`click`, searchCityName)

    const dayNigthModeParent = document.querySelector(`.day-night-mode`)
    dayNigthModeParent.addEventListener(`click`, (event) => {
        if (!lockClick) {
            if (event.target.id === 'day-mode') {
                if (!isDayModeActive) {
                    isDayModeActive = true
                    isAutoModeActive = false
                    isNightModeActive = false
                    rotateOrbit(DEGREE_90)
                }
            } else if (event.target.id === 'auto-mode') {
                if (!isAutoModeActive) {
                    isAutoModeActive = true
                    isDayModeActive = false
                    isNightModeActive = false
                    rotateOrbit(getAutoModeDegree())
                }
            } else if (event.target.id === 'night-mode') {
                if (!isNightModeActive) {
                    isNightModeActive = true
                    isDayModeActive = false
                    isAutoModeActive = false
                    rotateOrbit(DEGREE_270)
                }
            }
        }else{
            dayNigthModeParent.style.border = `3px solid red`
            setTimeout(() => {
                dayNigthModeParent.style.border = `none`
            }, 10)
        }
    })

    const unitChangeSelect = document.getElementById(`unit-change-select`)
    unitChangeSelect.addEventListener(`change`, (e) => {
        if(e.target.value === temperatureUnit) return
        temperatureUnit = e.target.value
        updateTemperatureValues()
    })
}

// other functions
const deleteAllPrevDiv = (divClassName) => {
    const elementsToRemove = document.querySelectorAll(`.${divClassName}`)
    const elementsArray = Array.from(elementsToRemove);
    elementsArray.forEach((e) => {
        e.remove()
    })
}

const checkForDayOrNight = (time) => {
    const { sunriseSunset } = weatherData
    const { sunriseHour, sunsetHour } = sunriseSunset
    const parsedSunriseHour = Math.floor(sunriseHour)
    const parsedSunsetHour = Math.floor(sunsetHour)
    const parsedTime = parseInt(time.slice(0, 2))
    if(parsedTime > parsedSunriseHour && parsedTime < parsedSunsetHour){
        return "day"
    }else{
        return "night"
    }
}

const getAutoModeDegree = () => {
    const { time, sunriseSunset } = weatherData
    const { currentHour } = time
    const parsedCurrentHour = parseInt(currentHour)
    const parsedSunriseHour = Math.floor(sunriseSunset.sunriseHour)
    const parsedSunsetHour = Math.floor(sunriseSunset.sunsetHour)
    let autoDegree = 0

    const sunsetSunriseDifferent = parsedSunsetHour - parsedSunriseHour

    if(parsedCurrentHour === parsedSunsetHour){
        autoDegree = 180
    }else if(parsedCurrentHour >= parsedSunriseHour && parsedCurrentHour < parsedSunsetHour){
        autoDegree = ( parsedCurrentHour - parsedSunriseHour ) * ( 180 / ( sunsetSunriseDifferent ))
    }else if(parsedCurrentHour > parsedSunsetHour && parsedCurrentHour <= 24){
        autoDegree = 180 + ((180 / (24 - sunsetSunriseDifferent)) * (currentHour - parsedSunsetHour))
    } else if(parsedCurrentHour >= 0 && parsedCurrentHour < parsedSunriseHour){
        autoDegree = 180 + ((180 / (24 - sunsetSunriseDifferent)) * (parsedSunriseHour - parsedCurrentHour))
    }
    return autoDegree
}

// launch program
fetchWeatherData()

