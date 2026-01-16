const api_key = 'bd241b1fad12794c2da2090f7aa26945';

const input = document.querySelector(".citySearch");
const srchbtn = document.querySelector('.srch');
srchbtn.addEventListener('click', handleSearch);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
});

function getCityName() {
    const value = input.value.trim();
    if (!value) return null;
    input.value = "";
    return value;
}
async function handleSearch() {
    const city = getCityName();
    if (!city) {
        alert("Please Enter Something")
        return;
    }
    try{
        const weatherData = await fetchWeatherData(city.toLowerCase());
        updateMap(`${weatherData.name}`);
        renderData(weatherData);
    }
    catch(err){
        alert(err.message);
        return;
    }
    
}

async function fetchWeatherData(city) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.message || "Failed to fetch weather");
    }
    return res.json();
}


function renderData(data){
    const city = document.querySelector('.locText');
    const temp = document.querySelector('.temp h1');
    const feelsLike = document.querySelector('.temp p'); 
    const visibility = document.querySelector('.visiblity p');
    const humidity = document.querySelector('.humidity p'); 
    city.textContent = `${data.name}, India`;
    temp.textContent = `${data.main.temp.toFixed(1)}°C`
    feelsLike.textContent = `Feels Like ${data.main.feels_like.toFixed(1)}°C`;
    visibility.textContent = `${Number(data.visibility)/1000}Km`
    humidity.textContent = `${data.main.humidity}%`;
    const weatherImg = document.querySelector('.firstHalf img');
    weatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    const weatherDesc = document.querySelector('.firstHalf h2');
    weatherDesc.textContent = `${data.weather[0].description}`;
    const sunset = document.querySelector('.secondHalf h2:nth-child(2)');
    const sunrise = document.querySelector('.secondHalf h2:nth-child(1)');
    const pressure = document.querySelector('.secondHalf h2:nth-child(3)');
    pressure.textContent = `Pressure: ${data.main.pressure} hpa`;
    sunrise.textContent = `Sunrise: ${formatTime(data.sys.sunrise, data.timezone)} AM`;
    sunset.textContent  = `Sunset: ${formatTime(data.sys.sunset, data.timezone)} PM`;
}
//new thing below
function formatTime(unixSeconds, timezoneSeconds) {
  const date = new Date((unixSeconds + timezoneSeconds) * 1000);
  return date.toUTCString().slice(17, 22); 
}

function updateMap(city) {
  const iframe = document.querySelector(".map iframe");

  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed`;
}