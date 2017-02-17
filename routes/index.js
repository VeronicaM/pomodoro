var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Basic Express App' });
});
router.get('/quote',function(req,res,next){
	  	
		var request = require('request');
		request('http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body) // Show the HTML for the Google homepage.
		    res.send(JSON.stringify(body));
		  }
		});

  });

 module.exports = router;

