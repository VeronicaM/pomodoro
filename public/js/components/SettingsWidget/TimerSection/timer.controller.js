
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
        this.pomodoroSessionTime = $("#countdown");
        this.breakTime = $("#breakMinutes");
        this.breakSound = $("#breakSound");
        this.workSound = $("#workSound");
        this.timerSetting = $(".timerSetting");

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
        this.timerSetting.change(this.onSettingsChange.bind(this));
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

        const {
            breakMinutes,
            countdown,
            breakSound,
            workSound,
            running,
            minutes,
            seconds,
            isBreak
        } = storedSettings;

        const settings = {
            breakMinutes: breakMinutes || "5",
            countdown: countdown || "25",
            breakSound: breakSound || "good-morning.mp3",
            workSound: workSound || "attention-seeker.mp3",
            running: running || false,
            minutes: minutes || countdown || "25",
            seconds: seconds || "00",
            isBreak: isBreak || false,
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
        const newOption = {};
        const key = e.currentTarget.getAttribute('id');
        let value = "";
        if (key.indexOf("S") > 0) {
            value = this.soundNames[e.currentTarget.value];
        } else {
            value = e.currentTarget.value;
        }

        newOption[key] = value;
        this.updateSettings(newOption);
    }
}