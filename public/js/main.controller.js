// Views Controller
import QuoteController from "./components/QuoteWidget/quote.controller";
import TasksController from "./components/TasksWidget/tasks.controller";
import SettingsController from "./components/SettingsWidget/settings.controller";
import WeatherController from "./components/WeatherWidget/weather.controller";

export default class MainController {
    constructor() {
        // init views controller
        this.quoteController = new QuoteController();
        this.settingsController = new SettingsController();
        this.tasksController = new TasksController();
        this.weatherController = new WeatherController();
    }
}