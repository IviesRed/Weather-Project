//Key
let apiKey = "3dbc7ff6d43c851d06e56b5f272d5357";

//Default data
let city = "Houston";
let unit = "metric";

//Api Urls
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
let apiUrlMulti = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

//Set up
let now = new Date();
let curTime = now.getMinutes();
let curHours = now.getHours();
let todayTemp = 0;
let tomoTemp = [0, 1, 2, 3];
let lat = 1;
let lon = 1;

//Sets AM OR PM depending on hour. Sets to 12 hour time
let highNoon = "AM";
if (curHours > 12) {
  curHours = curHours - 12;
  highNoon = "PM";
}
let curDay = now.getDay();

//Days Array
let curDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

//Modifying the top text
function updateTime() {
  axios.get(`${apiUrl}`).then(getTemps);
  let curTi = document.querySelector("#cTime");
  curTime = now.getMinutes();
  curHours = now.getHours();
  let fixer = "0";
  if (curTime > 9) {
    fixer = "";
  }
  if (curHours > 12) {
    curHours = curHours - 12;
    highNoon = "PM";
  }
  //Sets time
  curTi.innerHTML = `${curHours}:${fixer}${curTime} ${highNoon}`;
  let curDy = document.querySelector("#cDay");
  curDy.innerHTML = `on ${curDays[curDay]}`;
  updateDays();
}

//Updates the upcoming days
function updateDays() {
  let toAdd = "";
  let newVar = now.getDay();
  let listDays = [];
  let x = 1;
  while (5 >= x) {
    listDays[x - 1] = document.getElementById(x);
    toAdd = getFutureDate(newVar + x);
    listDays[x - 1].innerHTML = `${curDays[toAdd]}`;
    x = x + 1;
  }
}

//Updates the state and city based on the inputted values at the bottom, action sent from pressing button
function getValues(event) {
  event.preventDefault();
  let uInput = document.getElementById("input-id").value;
  lat = 0;
  lon = 0;
  if (uInput === "") {
    city = "houston";
  }
  newCity = document.querySelector("#nwCity");
  newCity.innerHTML = `${uInput}`;
  city = uInput;
  axios.get(`${apiUrl}`).then(getTemps);

  updateTime();
}

//Gets the date in the array based off the inserted value.
function getFutureDate(value) {
  if (value > 6) {
    value = value - 7;
    return value;
  } else {
    return value;
  }
}

//Changes values to Celsius
function toC(event) {
  event.preventDefault();
  updateTime();
  unit = "metric";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  newCity = document.querySelector("#nwCity");
  newCity.innerHTML = `${city}`;
  axios.get(`${apiUrl}`).then(getTemps);
}

//Changes values to Farenheit
function toF(event) {
  event.preventDefault();
  unit = "imperial";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  newCity = document.querySelector("#nwCity");
  newCity.innerHTML = `${city}`;
  axios.get(`${apiUrl}`).then(getTemps);
}

//Get temperature based on entered info
function getTemps(response) {
  todayTemp = response.data.main.temp;
  let h6 = document.querySelector("h6");
  h6.innerHTML = "Loading...";
  setTimeout(function () {
    // rest of code here
    apiUrlMulti = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
    axios.get(`${apiUrlMulti}`).then(accessDays);
  }, 2500);
}

//Multi day update
function accessDays(newt) {
  let x = 0;
  let cels = document.querySelectorAll("div.temp");
  let val = `F`;
  if (unit === `metric`) {
    val = `C`;
  }
  while (6 > x) {
    tomoTemp[x] = newt.data.list[x].main.temp;
    cels[x].innerHTML = `${tomoTemp[x]}° ${val}`;
    x = x + 1;
  }

  h6.innerHTML = "";
}

function getGeo(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}
function handlePosition(currentPlace) {
  lat = currentPlace.coords.latitude;
  lon = currentPlace.coords.longitude;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(updateGeo);
}

//Geo location based weather
function updateGeo(response) {
  todayTemp = response.data.main.temp;
  let h6 = document.querySelector("h6");
  h6.innerHTML = "Loading...";
  setTimeout(function () {
    // rest of code here
    let val = `F`;
    if (unit === `metric`) {
      val = `C`;
    }
    let cels = document.querySelectorAll("div.temp");
    cels[0].innerHTML = `${todayTemp}° ${val}`;
    apiUrlMulti = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    axios.get(`${apiUrlMulti}`).then(accessDays);
    h6.innerHTML = "";
  }, 2500);
  newCity.innerHTML = `Current Location`;
}

//Code needed to make the page run
updateTime();
let butn = document.getElementById("search_button");
butn.addEventListener("click", getValues);
let celsius = document.getElementById("celsius");
celsius.addEventListener("click", toC);
let farenh = document.getElementById("farenh");
farenh.addEventListener("click", toF);
axios.get(`${apiUrl}`).then(getTemps);
let h6 = document.querySelector("h6");
let curLoc = document.getElementById("here");
curLoc.addEventListener("click", getGeo);
let newCity = document.querySelector("#nwCity");
