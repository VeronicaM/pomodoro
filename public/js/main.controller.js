// Views Controller
import LinksController from "./components/Link/links.controller";
import QuoteController from "./components/QuoteWidget/quote.controller";
import TasksController from "./components/TasksWidget/tasks.controller";
import SettingsController from "./components/Settings/settings.controller";
import TimerController from "./components/Timer/timer.controller";
import WeatherController from "./components/WeatherWidget/weather.controller";

export default class MainController {
    constructor() {
        // elements
        this.menu = $(".menu");
        this.settings = $(".settings");

        // init views controller
        this.linksController = new LinksController();
        this.quoteController = new QuoteController();
        this.settingsController = new SettingsController();
        this.tasksController = new TasksController();
        this.timerController = new TimerController();
        this.weatherController = new WeatherController();
    }
    
    initView() {
        this.injectFavIcon();

        // add event listeners
        $(document).on("mouseup", this.onClickOutside);
    }

    injectFavIcon() {
        const favIco = require("../favicon.png");
        const link = $("<link></link>");
        link[0].type = "image/x-icon";
        link[0].rel = "shortcut icon";
        link[0].href = favIco;
        $("head")[0].append(link[0]);
    }

    onClickOutside(e) {
        if (
            this.menu.is(":visible") &&
            e.target !== this.settings[0] &&
            e.target !== this.menu[0] &&
            this.menu.has(e.target).length === 0
        ) {
            this.menu.hide();
        }
    }
}