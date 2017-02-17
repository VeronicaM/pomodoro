var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Basic Express App' });
});
router.get('/quote',function(req,res,next){
	  	
		var request = require('request');
		request('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		   // console.log(body) // Show the HTML for the Google homepage.
		    res.status(200).json(JSON.parse(body));
		  }
		});

  });

router.post('/weather',function(req,res,next){
	  	console.log("request body ",req.body);
	  	let lat="23",lon="24",unit="imperial";
		var request = require('request');
		request("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=5a65ddcbbe5bbecec36b72359651372e&units="+unit, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		   // console.log(body) // Show the HTML for the Google homepage.
		    res.status(200).json(JSON.parse(body));
		  }
		});

  });


 module.exports = router;

