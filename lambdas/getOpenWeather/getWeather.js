const https = require('https');
exports.handler = async (event, context) => {
    let dataString = '';
    
    const response = await new Promise((resolve, reject) => {
        const { lat, lon, units } = event.queryStringParameters;
        if (!lat || !lon || !units) {
            resolve({
                statusCode: 400,
                body: 'Please provide a lat, lon and units params!'
            })
        }
        
        const req = https.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=5a65ddcbbe5bbecec36b72359651372e&units=${units}`, function (res) {
            res.on('data', chunk => {
                dataString += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: dataString
                });
            });
        });

        req.on('error', (e) => {
            reject({
                statusCode: 500,
                body: 'Something went wrong!'
            });
        });
    });

    return response;
};