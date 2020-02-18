'use strict';

const express = require('express');

const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/location', (request, response) => {
  
  try{
    let city = request.query.city;
    let geoData = require('./data/geo.json');
  console.log(geoData);
    let location = new City(city, geoData[0]);
    console.log('location56465165', location);

    let dataObj = {
      "search_query": city,
      "formatted_query": geoData[0].display_name,
      "latitude": geoData[0].lat,
      "longitude": geoData[0].lon
    }
  
    response.status(200).json(location);
  }
  catch (err){
    console.log(err);
  }
})

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


// app.get('/weather', (request, response) => {
  
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


// function weatherHandler


app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
