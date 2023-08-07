//search bar and current weather fetch
const searchInput = document.querySelector("input");
const searchButton = document.querySelector("#searchButton");
let currentDataArray = [];
let forecastArray = [];
let currentWebcam = [];
let weatherTest = [];
let currentCountry = [];
let map = null;

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
    searchInput.blur();
  }
});

searchButton.addEventListener("click", () => {
  searchInput.blur();
  document
    .querySelectorAll(".mainHide")
    .forEach((i) => i.classList.remove("mainShow"));
  let cityName = searchInput.value;
  getCurrentWeather(cityName).then(() => {
    searchInput.value = "";
    weatherTest = currentDataArray;
    console.log(weatherTest);
    if (weatherTest[0].current.is_day === 0) {
      document.querySelector("body").classList.add("nightBG");
      document.querySelector("body").classList.remove("dayBG");
      let nightmodeDivs = document.querySelectorAll(
        "[class^='content']:not(.content1,.content2,.content4a,.content4b)"
      );
      let nightmodeDivsGroup = document.querySelector(".group1and2");
      let nightmodeSearch = document.querySelector(".search");
      let icons = document.querySelectorAll(".iconCondition");
      let input = document.querySelector("#citySearch");
      input.style.color = "white";
      nightmodeDivsGroup.classList.add("nightMode");
      nightmodeDivs.forEach((i) => i.classList.add("nightMode"));
      nightmodeSearch.classList.add("nightMode");
      icons.forEach((i) => i.classList.add("nightIcons"));
    } else if (weatherTest[0].current.is_day === 1) {
      document.querySelector("body").classList.remove("nightBG");
      document.querySelector("body").classList.add("dayBG");
      let nightmodeDivs = document.querySelectorAll(
        "[class^='content']:not(.content1,.content2,.content4a,.content4b)"
      );
      let nightmodeDivsGroup = document.querySelector(".group1and2");
      let nightmodeSearch = document.querySelector(".search");
      let icons = document.querySelectorAll(".iconCondition");
      let input = document.querySelector("#citySearch");
      nightmodeDivs.forEach((i) => i.classList.remove("nightMode"));
      nightmodeSearch.classList.remove("nightMode");
      nightmodeDivsGroup.classList.remove("nightMode");
      icons.forEach((i) => i.classList.remove("nightIcons"));
      input.style.color = "rgb(37, 37, 37)";
    }
    getLocation();
    containerOne();
    containerTwo();
    document
      .querySelectorAll(".mainHide")
      .forEach((i) => i.classList.add("mainShow"));
    getFacts(weatherTest[0].location.country).then(() => {
      console.log(currentCountry);
      let coatArms = document.querySelector("#coatArms");
      let flagImg = document.querySelector("#flag");
      let currName = Object.keys(currentCountry[0].currencies)[0];
      let currency = currentCountry[0].currencies;
      let currencyName = Object.entries(currency).filter(([key]) =>
        key.includes(currName)
      );
      let langName = Object.keys(currentCountry[0].languages)[0];
      let language = currentCountry[0].languages;
      let languageName = Object.entries(language).filter(([key]) =>
        key.includes(langName)
      );
      coatArms.src = currentCountry[0].coatOfArms.svg;
      flagImg.src = currentCountry[0].flags.svg;
      document.querySelector(
        ".languages"
      ).innerHTML = `<b>Language:</b> ${languageName[0][1]}`;
      document.querySelector(
        ".population"
      ).innerHTML = `<b>Population:</b> ${currentCountry[0].population.toLocaleString(
        "en-US"
      )}`;
      document.querySelector(
        ".currency"
      ).innerHTML = `<b>Currency:</b> ${currencyName[0][1].name}, ${currencyName[0][1].symbol}`;
      document.querySelector(".countryOffName").innerHTML =
        currentCountry[0].name.official;
    });
    getMap(weatherTest[0].location.lat, weatherTest[0].location.lon);
  });
  getForecastDay(cityName).then(() => {
    console.log(forecastArray);
    containerThree();
    containerFour();
  });
  document.querySelector(".main").classList.remove("mainMax");
  document.querySelector(".main").classList.add("mainMax");
});

async function getCurrentWeather(string) {
  let currentData;
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=6ab32f19a8624a1ab19100757230508&q=${string}`,
    { mode: "cors" }
  );
  currentData = await response.json();
  currentDataArray = [];
  currentDataArray.push(currentData);
  return;
}

async function getForecastDay(string) {
  let currentData;
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json.json?key=6ab32f19a8624a1ab19100757230508&q=${string}&days=3`,
    { mode: "cors" }
  );
  currentData = await response.json();
  forecastArray = [];
  forecastArray.push(currentData);
  return;
}

function clearContainer() {
  let mainIcon = document.getElementById("currentIcon");
  let currentTemp = document.querySelector(".currentTemp");
  let currentCond = document.querySelector(".currentCond");
  let humidity = document.getElementById("humidity");
  let precipitation = document.querySelector("#precipitation");
  let windSpeed = document.querySelector("#windSpeed");
  let feelsLike = document.querySelector("#feelsLike");
  document.querySelector("#city").innerHTML = "";
  document.querySelector("#region").innerHTML = "";
  document.querySelector("#zone").innerHTML = "";
  mainIcon.src = weatherTest[0].current.condition.icon;
  currentCond.innerHTML = "";
  currentTemp.innerHTML = "";
  humidity.innerHTML = "";
  precipitation.innerHTML = "";
  windSpeed.innerHTML = "";
  feelsLike.innerHTML = "";
}

//Location info
function getLocation() {
  if (Array.from(weatherTest[0].location.name).length > 14) {
    let cityName = weatherTest[0].location.name.substring(0, weatherTest[0].location.name.indexOf(" "));
    document.querySelector("#city").innerHTML = cityName;
  } else {
    let cityName = weatherTest[0].location.name;
    document.querySelector("#city").innerHTML = cityName;
  }
  document.querySelector("#region").innerHTML = weatherTest[0].location.region;
  document.querySelector("#zone").innerHTML = weatherTest[0].location.country;
  document.querySelector(".localTime").innerHTML = weatherTest[0].location.localtime.substring(weatherTest[0].location.localtime.indexOf(" "),weatherTest[0].location.localtime.length);
}

//container1 info

function containerOne() {
  let mainIcon = document.getElementById("currentIcon");
  let currentTemp = document.querySelector(".currentTemp");
  let currentCond = document.querySelector(".currentCond");
  console.log(weatherTest[0].current.condition.code);
  //if (weatherTest[0].current.is_day === 1) {
  mainIcon.src = weatherTest[0].current.condition.icon;
  currentCond.innerHTML = weatherTest[0].current.condition.text;
  currentTemp.innerHTML = weatherTest[0].current.temp_c + " ºC";
}

// container 2 info

function containerTwo() {
  let humidity = document.getElementById("humidity");
  let precipitation = document.querySelector("#precipitation");
  let windSpeed = document.querySelector("#windSpeed");
  let feelsLike = document.querySelector("#feelsLike");
  humidity.innerHTML = `<b>${weatherTest[0].current.humidity}%</b>  humidity`;
  precipitation.innerHTML = `<b>${weatherTest[0].current.precip_mm} mm</b> of precipitation`;
  windSpeed.innerHTML = `from <b>${
    weatherTest[0].current.wind_dir
  }</b>  at  <b>${Math.round(weatherTest[0].current.wind_kph)}</b> Km/h`;
  feelsLike.innerHTML = `feels like  <b>${Math.round(
    weatherTest[0].current.feelslike_c
  )} ºC</b>`;
  document.querySelector(
    "#uvIndex"
  ).innerHTML = `UV index: <span><b>${weatherTest[0].current.uv}</b></span>`;
  if (weatherTest[0].current.uv >= 8) {
    document.querySelector("#uvIndex>span").style.color = "red";
  } else if (weatherTest[0].current.uv >= 6 || weatherTest[0].current.uv < 8) {
    document.querySelector("#uvIndex>span").style.color = "orange";
  } else if (weatherTest[0].current.uv >= 3 || weatherTest[0].current.uv < 6) {
    document.querySelector("#uvIndex>span").style.color = "yellow";
  } else if (weatherTest[0].current.uv < 3) {
    document.querySelector("#uvIndex>span").style.color = "green";
  }
}

// container 3 info

function containerThree() {
  let dailyTemp = document.getElementById("dailyTemp");
  let dailyRain = document.querySelector("#dailyRain");
  let dailySnow = document.querySelector("#dailySnow");
  let forecastIcon = document.querySelector("#forecastCond");
  let forecastText = document.querySelector("#dailyCondition");
  let sunRise = document.querySelector("#sunRise");
  dailyTemp.innerHTML = `Max: <b>${Math.round(
    forecastArray[0].forecast.forecastday[0].day.maxtemp_c
  )}</b>ºC  Min: <b>${Math.round(
    forecastArray[0].forecast.forecastday[0].day.mintemp_c
  )}</b>ºC`;
  dailyRain.innerHTML = `<b>${forecastArray[0].forecast.forecastday[0].day.daily_chance_of_rain} %</b> chance of rain`;
  dailySnow.innerHTML = `${forecastArray[0].forecast.forecastday[0].day.daily_chance_of_snow} %`;
  sunRise.innerHTML = `Day:  <b>${forecastArray[0].forecast.forecastday[0].astro.sunrise}</b> - <b>${forecastArray[0].forecast.forecastday[0].astro.sunset}</b>`;
  forecastIcon.src =
    forecastArray[0].forecast.forecastday[0].day.condition.icon;
  forecastText.innerHTML =
    forecastArray[0].forecast.forecastday[0].day.condition.text;
}

// container 4 info

function containerFour() {
  let tomorrowTemp = document.getElementById("tomorrowTemp");
  let nextTemp = document.getElementById("nextTemp");
  let tomorrowRain = document.querySelector("#tomorrowRain");
  let nextRain = document.querySelector("#nextRain");
  let tomorrowIcon = document.querySelector("#forecastTomorrow");
  let nextIcon = document.querySelector("#forecastNext");
  let tomorrowSnow = document.querySelector("#tomorrowSnow");
  let nextSnow = document.querySelector("#nextSnow");
  tomorrowTemp.innerHTML = `<b>${Math.round(
    forecastArray[0].forecast.forecastday[1].day.maxtemp_c
  )}</b>ºC  <b>${Math.round(
    forecastArray[0].forecast.forecastday[1].day.mintemp_c
  )}</b>ºC`;
  nextTemp.innerHTML = `<b>${Math.round(
    forecastArray[0].forecast.forecastday[2].day.maxtemp_c
  )}</b>ºC  <b>${Math.round(
    forecastArray[0].forecast.forecastday[2].day.mintemp_c
  )}</b>ºC`;
  tomorrowRain.innerHTML = `${forecastArray[0].forecast.forecastday[1].day.daily_chance_of_rain}%`;
  nextRain.innerHTML = `${forecastArray[0].forecast.forecastday[2].day.daily_chance_of_rain}%`;
  tomorrowIcon.src =
    forecastArray[0].forecast.forecastday[1].day.condition.icon;
  nextIcon.src = forecastArray[0].forecast.forecastday[2].day.condition.icon;
  tomorrowSnow.innerHTML = `${forecastArray[0].forecast.forecastday[2].day.daily_chance_of_snow}%`;
  nextSnow.innerHTML = `${forecastArray[0].forecast.forecastday[2].day.daily_chance_of_snow}%`;
}

//container 5

async function getFacts(string) {
  const response = await fetch(`https://restcountries.com/v3.1/name/${string}`);
  currentCountry = await response.json();
  return;
}

//container 6

function getMap(lat, lon) {
  if (map == null) {
    map = L.map("map").setView([lat, lon], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
  } else {
    map.remove();
    map = L.map("map").setView([lat, lon], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
  }
}
