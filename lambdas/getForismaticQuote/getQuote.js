const https = require('https');

exports.handler = async () => {
  let dataString = '';

  const response = await new Promise((resolve, reject) => {
    const req = https.get(
      'https://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en',
      (res) => {
        res.on('data', (chunk) => {
          dataString += chunk;
        });
        res.on('end', () => {
          if (dataString) {
            const quoteBody = dataString;
            let quote = {};

            if (dataString.indexOf('(') > -1) {
              const quoteBodyBits = quoteBody.split('(');
              const [quoteText, quoteAuthor] = quoteBodyBits;

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

            return resolve({
              statusCode: 200,
              body: JSON.stringify(quote),
            });
          }

          return resolve({
            statusCode: 200,
            body: 'Quote service not available',
          });
        });
      },
    );

    req.on('error', () => {
      reject({ // eslint-disable-line prefer-promise-reject-errors
        statusCode: 500,
        body: 'Something went wrong!',
      });
    });
  });

  return response;
};
