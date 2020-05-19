const express = require('express');
const request = require('request');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Pomodoro App' });
});

router.get('/quote', (req, res) => {
  request(
    'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en',
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let quoteBody = body;
        let quote = {};

        if (body.indexOf('(') > -1) {
          quoteBody = body.split('(');
          const [quoteText, quoteAuthor] = quoteBody;

          quote = {
            quoteText,
            quoteAuthor: quoteAuthor.substring(0, quoteAuthor.length - 1),
          };
        } else {
          quote = {
            quoteText: quoteBody,
            quoteAuthor: 'Unknown',
          };
        }

        res.status(200).json(quote);
      }
    },
  );
});

router.post('/weather', (req, res) => {
  const data = req.body;
  request(
    `http://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=5a65ddcbbe5bbecec36b72359651372e&units=${data.units}`,
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        res.status(200).json(JSON.parse(body));
      }
    },
  );
});

module.exports = router;
