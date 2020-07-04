// services
import { buildURL } from '../../services/endpoint.service';

// helpers
import { setSource, updateText } from '../../common/utils';

export default class WeatherController {
  constructor() {
    // elements
    this.container = $('.weather-widget');
    this.icon = $('.weather-widget__icon');
    this.closeBtn = $('#closeWeather');
    this.temperature = $('.weather-widget__temperature');
    this.description = $('.weather-widget__text');
    this.locationLabel = $('.weather-widget__location');
    this.widgetToggle = $('.weather-widget__trigger');

    this.state = {
      units: 'metric',
    };

    this.initView();
  }

  initView() {
    this.displayWeather();

    // add event listeners
    this.closeBtn.on('click', this.onContainerHide.bind(this));
    this.widgetToggle.on('click', this.onContainerToggle.bind(this));

    // toggle Celcius/ Farenheit
    this.temperature.on('click', this.onTemperatureToggle.bind(this));
  }

  updateState(newState) {
    this.state = { ...this.state, newState };
  }

  getWeather(units) {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude: lat, longitude: lon } = position.coords;

          const URL = buildURL('GET_WEATHER', {
            lat,
            lon,
            unit: units || this.state.units,
          });

          $.post(URL).done((weatherData) => {
            const result = JSON.parse(weatherData);

            resolve({
              temp: Math.round((result.main && result.main.temp) || 0),
              description: result.weather[0].description,
              imgURL: `http://openweathermap.org/img/w/${result.weather[0].icon}.png`,
              location: result.name,
            });
          });
        });
      } else {
        resolve({
          temp: 0,
          description: 'Unknown Weather',
          imgURL: '',
          location: 'Unkown',
        });
      }
    });
  }

  displayTemperature(temp, unit) {
    const unitLabel = unit === 'metric' ? 'C' : 'F';
    const degreeSymbol = String.fromCharCode(176);
    const tempString = `${temp} ${degreeSymbol} ${unitLabel}`;

    updateText(this.temperature, tempString);
  }

  displayWeather(units) {
    return this.getWeather(units).then((weatherData) => {
      const {
        imgURL, description, temp, location,
      } = weatherData;

      setSource(this.icon, imgURL);
      updateText(this.description, description);
      updateText(this.locationLabel, location);

      this.displayTemperature(temp, units || this.state.units);
    });
  }

  handleSwitchToUnit(unit) {
    this.updateState({
      units: unit,
    });

    updateText(this.temperature, '');

    this.displayWeather(unit);
  }

  onTemperatureToggle() {
    const text = this.temperature.text();

    if (text.indexOf('C') >= 0) {
      this.handleSwitchToUnit('imperial', 'F');
    } else {
      this.handleSwitchToUnit('metric', 'C');
    }
  }

  onContainerHide() {
    this.container.hide();
  }

  onContainerToggle(e) {
    if (e.target === this.widgetToggle[0]) {
      this.container.toggle();
    }
  }
}
