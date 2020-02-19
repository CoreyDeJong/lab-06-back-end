'use strict';

//express is the server, this defines how to connect to express
const express = require('express');
const app = express();


const superagent = require('superagent');

//cors is a library that is the policeman
const cors = require('cors');
app.use(cors());


//.env is the hidden files where you keep your api keys
require('dotenv').config();

//go into the .env file and look for PORT to see which path to take, if it doesn't work, then use 3001
const PORT = process.env.PORT || 3001;


//front end web site is sending information through the '/location' input field once the user hits submit when they enter a city name, "seattle" for example. (request, response) are the parameters of how the information is being sent, they can be called anything
app.get('/location', (request, response) => {

  //query will be all the information sent over by the front end from the user (including user name, ip address....) but we only care about the city in this example, so we need to let city = exactly where city info is at. you can use console.log(request.query); to see all the info that is coming from the front end
    let city = request.query.city;
    
    // let geoData = require('./data/geo.json');
    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

    
    
    superagent.get(url)
    .then(results => {
      console.log('results from superagent', results.body);
      let geoData = results.body;
      let location = new City(city, geoData[0]);

      //once the location has been defined, send that info as a response back to the front end
      response.status(200).send(location);
    })
    
  })
  
  app.get('/weather', (request, response) => {
    let {search_query, formatted_query, latitude, longitude} = request.query;
    // { search_query: 'tacoma',
    // formatted_query: 'Lynnwood, Snohomish County, Washington, USA',
    // latitude: '47.8278656',
    // longitude: '-122.3053932' }
    
    // update with darksky info
        let city = request.query.city;
        // let geoData = require('./data/geo.json');
        let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

        //remove
    let darkSky = require('./data/darksky.json');


    //add superagent
    // superagent.get(url)
    // .then(results => {
    //   console.log('results from superagent', results.body);
    //   let geoData = results.body;
    //   let location = new City(city, geoData[0]);
    //   response.status(200).send(location);
    // })








  let weatherArray = darkSky.daily.data;

  let newWeatherArray = [];
  weatherArray.forEach(day => {
    newWeatherArray.push(new Weather(day));
  })
  
  response.send(newWeatherArray)
})


//constructor to take in data from the object from all the info from the front end and define this relative to how they are defined in the object.
function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function Weather(day){
  this.time = new Date(day.time).toDateString();
  this.forecast = day.summary;
}

//event listener to turn on the server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})






////////original from 2.18//////////

// 'use strict';

// const express = require('express');

// const app = express();

// require('dotenv').config();

// const cors = require('cors');
// app.use(cors());

// const PORT = process.env.PORT || 3001;

// app.get('/location', (request, response) => {
  
//   try{
//     let city = request.query.city;
//     let geoData = require('./data/geo.json');
//             console.log(geoData);
//     let location = new City(city, geoData[0]);
//             console.log('location56465165', location);

//     let dataObj = {
//       //"search_query" is what is coming from the front-end, will need info from trello board or inspect front-end file
//       "search_query": city,
//       "formatted_query": geoData[0].display_name,
//       "latitude": geoData[0].lat,
//       "longitude": geoData[0].lon
//     }
  
//     response.send(location);
//   }
//   catch (err){
//     console.log(err);
//   }
// })

// function City(city, obj){
//   this.search_query = city;
//   this.formatted_query = obj.display_name;
//   this.latitude = obj.lat;
//   this.longitude = obj.lon;
// }


// app.get('/weather', (request, response) => {
//   let city = request.query.city;
//   let darkSky = require('./data/darksky.json')
  
//   let weatherArray = darkSky.daily.data;
  
//   let newWeatherArray = [];

//   weatherArray.forEach(day => {
//     new Weather(day.time, day.summary);
//   }
    

//   function Weather(day){
//     this.time = day.time;
//     this.forecast = day.summary;
//   }





//   try{
//     let city = request.query.city;
//     let geoData = require('./data/darksy.json');
//   console.log(geoData);
//     let location = new City(city, geoData[0]);
//     console.log('location56465165', location);

//     let dataObj = {
//       "search_query": city,
//       "formatted_query": geoData[0].display_name,
//       "latitude": geoData[0].lat,
//       "longitude": geoData[0].lon
//     }
  
//     response.status(200).json(location);
//   }
//   catch (err){
//     console.log(err);
//   }
// })

//   function Weather(day){
//     this.forecast = day.summary;
//     this.time = new Date
  
// }


// function weatherHandler//


// app.listen(PORT, () => {
//   console.log(`listening to ${PORT}`);
// });
