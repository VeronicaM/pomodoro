const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Basic Express App' });
});

router.get('/quote', (req, res, next) => {
  const request = require('request');
  request(
    'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en',
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let quoteBody = body;
        const quote = {};

        if (body.indexOf('(') > -1) {
          quoteBody = body.split('(');
          quote.quoteText = quoteBody[0];
          quote.quoteAuthor = quoteBody[1].substring(
            0,
            quoteBody[1].length - 1,
          );
        } else {
          quote.quoteText = quoteBody;
          quote.quoteAuthor = 'Unknown';
        }
        console.log(quote, quoteBody);
        res.status(200).json(quote);
      }
    },
  );
});

router.post('/weather', (req, res, next) => {
  const data = req.body;

  const request = require('request');
  request(
    `http://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=5a65ddcbbe5bbecec36b72359651372e&units=${data.units}`,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.status(200).json(JSON.parse(body));
      }
    },
  );
});

module.exports = router;
