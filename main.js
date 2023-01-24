let MAPBOX_API_KEY = "pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ",
  OPENWEATHER_API_KEY = '166a433c57516f51dfab1f7edaed8413';

mapboxgl.accessToken = MAPBOX_API_KEY

// This code uses the getCurrentPosition() method from the navigator.geolocation API to retrieve the user's current location.
// It takes three parameters: a successLocation function, an errorLocation function and an object of options.
// The enableHighAccuracy option specifies that the user's device should be set to its highest accuracy setting,
// allowing for better and more precise location data to be retrieved.


navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true
})

// This code defines the function successLocation, which takes a position object as an argument.
// This function sets up a map based on the longitude and latitude from the position object.
// The setupMap function takes an array of two values as an argument,
// with the first value representing the longitude and the second value representing the latitude.

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude])
}

// This code sets up a map object at the specified coordinates (-98.4946, 29.4252).
// The setupMap() function is called, which takes an array of two values,
// representing longitude and latitude, respectively. The map object is then used to display the location on a map.

function errorLocation() {
  setupMap([-98.4946, 29.4252])
}

// This code snippet is a simple asynchronous function that uses the XMLHttpRequest object in JavaScript to make a GET request to a given URL.
// The function returns a promise that is resolved when the request is successful and rejected if there is an error.
// The data parameter passed to the function is used in the request body, while the url parameter is the address that is being requested.
// Once the request is successful, the responseText is passed as an argument to the fulfilled promise. Otherwise, the statusText is passed to the rejected promise.

async function doAjax( data, url ) {
  return myPromise = new Promise(function(resolved, rejected){
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url);
    ajax.send(data);
    ajax.onreadystatechange = ()=>{
      if (ajax.readyState === 4) {
        if (ajax.status === 200) { resolved(ajax.responseText); }
        else { rejected(ajax.statusText); }
      }
    };
  });
}

// This code creates a map using the Mapbox GL JS library and sets the center of the map to the parameter 'center'.
// It also sets the zoom level to 5 and uses the navigation-night-v1 style.
// Additionally, it assigns a container element with the ID 'map' to the map.

function setupMap(center) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/navigation-night-v1",
    center: center,
    zoom: 5
  })

  // This code is written in JavaScript and is used to create a navigation control on a Mapbox map.
  // It first initializes a new instance of the Mapbox Navigation Control,
  // which provides an easy way for a user to switch between different map styles, and add it to the map.
  // It then initializes a new instance of the Mapbox Directions plugin and adds it to the map as a control.
  // The Mapbox Directions plugin allows the user to enter a start and end point, and will calculate the best route from point A to point B.


  const nav = new mapboxgl.NavigationControl()
  map.addControl(nav)

  let directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  })

  // This code adds a direction control to a map and upon clicking the map,
  // it will get the coordinates and longitude of the click position and make an API call to the OpenWeatherMap API.
  // The API call will return data about the current weather at the click position.
  // A Promise is created to handle the API call with the doAjax() function.

  map.addControl(directions, "top-left")

  map.on('click', (e) => {
    let posXCord = e.point.x
    let posYCord = e.point.y
    let posLat = e.lngLat.wrap().lat;
    let posLng = e.lngLat.wrap().lng;

    let url = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${posLat}&lon=${posLng}&exclude=hourly&appid=${OPENWEATHER_API_KEY}`
    let myPromise = doAjax("", url)


    // This code is written in JavaScript and creates a div element with a string of data from a JSON file.
    // The code first parses the data from the JSON file, setting the timezone and daily data to variables.
    // Then, a for loop is used to iterate the daily data. For each day, the temperature, weather, and description are stored in variables.
    // The variables are then concatenated into a single string, formatted with HTML,
    // and applied to the innerHTML of the div element. Finally, the string is logged to the console.


    myPromise.then(
      data => {
        data = JSON.parse(data)

        let timezone = data.timezone
        daily = data.daily;

        let span = document.createElement("div");
        let x = "";

        for( let i = 0; i < 5; i++){
          let thisDay = daily[i];
          let weather = thisDay.weather[0];

          x = x.concat(" ",
            `Day ${i}<br>
              Daytime temperature: ${thisDay.temp.day}<br>
              Weather: ${weather.main}<br>
              Weather description: ${weather.description}<br>
              <hr>
            `)
        }

        span.innerHTML = x;
        console.log(x)


        // This code is written in Javascript and is used to display a pop-up window with specific weather information.
        // It takes two arguments, which are the title and the content to be displayed in the pop-up window.
        // It then uses the 'swal' function to create a pop-up window with the specified title and content.
        // It also sets the 'button' and 'allowOutsideClick' options to "Done" and "true" respectively.
        // Finally, it uses a 'y' function to display an error message if the weather information can't be retrieved.


        swal({
          title: "Weather Info",
          content: span,
          button: "Done",
          allowOutsideClick: "true"
        });

      },
      y => { console.log("An error occured: " + y); }
    );

  });
}

