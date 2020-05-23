
// helpers
import { swap } from '../../../common/utils';

const sounds = {
    Jubilation: "jubilation.mp3",
    "Give me your attention": "attention-seeker.mp3",
    "Good Morning": "good-morning.mp3",
    Chime: "long-chime-sound.mp3",
    "Hey you": "obey.mp3",
    Solemn: "solemn.mp3",
    "Tic Tac": "oringz-w435.mp3",
};

export default class TimerController {
    constructor() {
        // settings options
        this.pomodoroSessionTime = $("#js-countdown");
        this.breakTime = $("#js-break-minutes");
        this.breakSound = $("#js-break-sound");
        this.workSound = $("#js-work-sound");
        this.settingsOption = $(".settings-widget-timer__option");

        // state
        this.soundNames = {
            Jubilation: "jubilation.mp3",
            "Give me your attention": "attention-seeker.mp3",
            "Good Morning": "good-morning.mp3",
            Chime: "long-chime-sound.mp3",
            "Hey you": "obey.mp3",
            Solemn: "solemn.mp3",
            "Tic Tac": "oringz-w435.mp3",
        };

        this.settings = this.getSettings();

        // add event listeners
        this.settingsOption.change(this.onSettingsChange.bind(this));
    }

    updateState(newState) {
        this.state = { ...this.state, newState };
    }

    initSettings() {
        const { countdown, breakValue, breakSound, workSound } = this.settings;
        this.pomodoroSessionTime.val(countdown);
        this.breakTime.val(breakValue);
        this.breakSound.val(this.soundsNames[breakSound]);
        this.workSound.val(this.soundsNames[workSound]);
    }

    getSettings() {
        const storedSettings = JSON.parse(localStorage.getItem("pomodoroSettings")) || {};

        const settings = {
            'break-minutes': storedSettings['break-minutes'] || "5",
            countdown: storedSettings['countdown'] || "25",
            'break-sound': storedSettings['break-sound'] || "good-morning.mp3",
            'work-sound': storedSettings['work-sound'] || "attention-seeker.mp3"
        };

        localStorage.setItem("pomodoroSettings", JSON.stringify(settings));

        return settings;
    }

    updateSettings(option) {
        const storedSettings = JSON.parse(localStorage.getItem("pomodoroSettings")) || {};
        const updatedSettings = { ...storedSettings, ...option };
        localStorage.setItem("pomodoroSettings", JSON.stringify(updatedSettings));
        this.settings = updatedSettings;
    }

    onSettingsChange(e) {
        const getCleanId = (id) => id.replace('js-', '');

        const newOption = {};
        const key = getCleanId(e.currentTarget.getAttribute('id'));
        let value = "";
        if (key.indexOf("sound") > 0) {
            value = this.soundNames[e.currentTarget.value];
        } else {
            value = e.currentTarget.value;
        }

        newOption[key] = value;
        this.updateSettings(newOption);
    }
}