export const endpointsURLs = {
  GET_WEATHER:
        'https://rfxbk8gcti.execute-api.eu-west-2.amazonaws.com/default/getOpenWeather?lat=:lat&lon=:lon&units=:unit',
  GET_QUOTE:
        'https://1k2r38b4w2.execute-api.eu-west-2.amazonaws.com/default/getForismaticQuote',
};

export const buildURL = (endpointName = '', params = {}) => {
  // return empty string if no endpoint name passed
  if (endpointName === '') return '';

  let urlWithParams = endpointsURLs[endpointName];

  // replace params specified as :paramName in the endpoint URL with corresponding values
  Object.entries(params).forEach(([paramName, paramValue]) => {
    urlWithParams = urlWithParams.replace(`:${paramName}`, paramValue);
  });

  return urlWithParams;
};
