
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
        this.soundNames = swap(sounds);

        this.initView();
    }

    initView() {
        this.settings = this.getSettings();

        this.renderSettings();

        // add event listeners
        this.settingsOption.change(this.onSettingsChange.bind(this));

        // TODO dispatch event session has begun with countdown
        
    }

    updateState(newState) {
        this.state = { ...this.state, newState };
    }

    renderSettings() {
        this.pomodoroSessionTime.val(this.settings['countdown']);
        this.breakTime.val(this.settings['break-minutes']);
        this.breakSound.val(this.soundNames[this.settings['break-sound']]);
        this.workSound.val(this.soundNames[this.settings['work-sound']]);
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
        const updatedSettings = { ...this.settings, ...option };
        localStorage.setItem("pomodoroSettings", JSON.stringify(updatedSettings));
        this.settings = updatedSettings;
    }

    onSettingsChange(e) {
        const getCleanId = (id) => id.replace('js-', '');

        const newOption = {};
        const key = getCleanId(e.currentTarget.getAttribute('id'));
        let value = "";
        if (key.indexOf("sound") > 0) {
            value = sounds[e.currentTarget.value];
        } else {
            value = e.currentTarget.value;
        }

        newOption[key] = value;
        this.updateSettings(newOption);
    }
}