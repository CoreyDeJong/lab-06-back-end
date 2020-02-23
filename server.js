'use strict';

// lets us go into the .env file and get the important secrets(PORT, API Keys, Database URL with password,...)
require('dotenv').config();

// brings in the expresss library which is our server. It is the library that the server uses to receive info from the user
const express = require('express');
// initializing the express library into a const called app
const app = express();

// the policeman - lets the server know that it is OK to give information to the front end
const cors = require('cors');
app.use(cors());

//pg is the postgress library that connects the server to the database, these are are in the node modules
const pg = require('pg');

// in the pg library(postgress that connects the server to the database), there is a constructor called Client, and this will connet through that database.url defined in the .env file
const database = new pg.Client(process.env.DATABASE_URL);
database.on('error', err => console.error(err));




// get the port from the .env file, process is just how the code is supposed to be written, or 3001 if the first port is bad
const PORT = process.env.PORT || 3001;

// connects to API's
const superagent = require('superagent');



// app is the express server, getting a request of the "location" as defined by the user
app.get('/location', (request, response) => {

  // city will equal the city that is defined in the request query
  let city = request.query.city;

  // defining let variables that will be used to look in my DB to see if location already exists. $1 is the safevalue to prevent hackers from inserting into database
  let sql = 'SELECT * FROM locations WHERE search_query=$1';
  let safeValues = [city];

//client request is querying the database using the 
database.query(sql, safeValues)
  .then(results => {

    //query will always return an array, length of rows greater than 0, you know you have data
    if(results.rows.length > 0){

     //send the results from the rows as a response, index 0 to only send that value and not the entire array in that row.
    response.send(results.rows[0]);
      } 
      
    else {
      //if database does not have the data, then go to the api. Save it to the database and save it to the front end
      
      // url will now have a url that includes the city that was just defined and include your api key. 
      let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;
      
      // console.log(url);
      

    // superagent will use the now defined url that includes city and api key
      superagent.get(url)
        .then(superagentResults => {
          let location = new City(city, superagentResults.body[0])
          
          //insert data into database so it can be referenced again
          let sql='INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
          let safeValues = [location.search_query, location.formatted_query, location.latitude, location. longitude];

          //send the sql and safevalues into the database using a query
          database.query(sql, safeValues);
          
          response.send(location);
        })
      }
    })
})

app.get('/weather', (request, response) => {
  let locationObject = request.query;
  // console.log(locationObject)

  let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${locationObject.latitude},${locationObject.longitude}`;

  // console.log(url);
  superagent.get(url)
    .then(results => {
      let weatherArray = results.body.daily.data;

      let weatherMap = weatherArray.map(day => new Weather(day));

      response.status(200).send(weatherMap);
      // loop over the array
      // send in each object to the constructor
    })
})

app.get('/movies', (request, response) => {
  let location = request.query.search_query;
  console.log("request search query", request.search_query);

  let url = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${location}`;

superagent.get(url)
//promise to not run until the url is defined
  .then(results1 => {
    // console.log('movie superagent results', results.body);
    let movieData = results1.body.results;
    let movieResults = movieData.map((data) => (new Movie(data)));
    response.send(movieResults);
  })
  .catch(err =>{
    response.status(500).send(err);
  });
});

function Movie(obj){
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}

app.get('/yelp', handleYelp);

function handleYelp(request, response){
  let city = request.query.search_query;
 
  let url = `https://api.yelp.com/v3/businesses/search?location=${city}`;

  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(results => {
      // console.log(results.body.businesses);
      let dataObj = results.body.businesses.map(business => {
        return new Yelp(business);
      });
      response.status(200).send(dataObj);
  });
}


function Yelp(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}


app.get('/trails', (request, response) => {
  let { latitude, longitude, } = request.query;

  let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAILS_API}`;

  // console.log(url);

  superagent.get(url)
    .then(results => {
      const dataObj = results.body.trails.map(trail => new Trail(trail));
      response.status(200).send(dataObj)
    })
})

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function Weather(obj){
  this.time = new Date(obj.time*1000).toDateString();
  this.forecast = obj.summary;
}

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.condition_date = obj.conditionDate.slice(0,10);
  this.condition_time = obj.conditionDate.slice(11,19);
}

// connect to database, then will tell you if it is connected, will tell you listening on port....
database.connect()
  .then(() =>{

// turn on the server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
})
  
  

