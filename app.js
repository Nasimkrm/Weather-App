//jshint esversion:6


const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

var path = require('path')
const dotenv = require("dotenv") 

dotenv.config()
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs')


app.use(bodyParser.urlencoded({extended: true}));

// what should happen when the browser makes a get request
app.get("/", function(req, res) {

  res.sendFile("/index.html",{root:__dirname})


});

app.post("/", function(req, res){

  // To make it shorter we make a url
  const query = req.body.cityName.toUpperCase();
  
  const apiKey = process.env.API_KEY;
  
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  // Our server makes a get request to another server(weather map)
  https.get(url, function(response) {


    
  console.log(response.statusCode);

  //To get hold of the data from the response

  response.on("data", function(data) {

    const weatherData = JSON.parse(data);
    const temp = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imageUrl =  "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    //We have to tap into the 'res', because it's our server which responds.
res.render("weather",{query, temp, weatherDescription,  img:imageUrl} )



  });

  });



});



app.listen(3000, function() {

  
  console.log("Server is running on port 3000.")
  


});
