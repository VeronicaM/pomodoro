// helpers
import { updateText } from '../../common/utils';
import TimerController from '../SettingsWidget/TimerSection/timer.controller';

// constants
const blackCat = require('../../../images/black-cat.png');

const getTimeDigits = (time) => {
  const timeString = time.toString();
  return timeString.length > 1 ? timeString.split('') : `0${timeString}`.split('');
};

const notifySessionEnd = (message, audioN, title) => {
  const audio = new Audio(audioN);
  audio.play();
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: blackCat,
      body: message,
    });

    notification.addEventListener(
      'click',
      (e) => {
        window.focus();
        e.target.close();
      },
      false,
    );
  }
};

export default class ClockController {
  constructor() {
    // digits
    this.minutesFirstDigit = $('time div:nth-of-type(1) span');
    this.minutesSecondDigit = $('time div:nth-of-type(2) span');
    this.secondsFirstDigit = $('time div:nth-of-type(4) span');
    this.secondsSecondDigit = $('time div:nth-of-type(5) span');

    // text
    this.messageContainer = $('.message');
    this.statusBarTitle = $('title');

    // buttons
    this.cta = $('#start');

    // state
    this.settings = TimerController.getSettings();

    this.config = {
      endMsg: `Hey, your pomodoro session of ${this.settings.countdown} minutes is over! Come take a break and cross out your finished tasks!`,
      breakEndMsg: `Hey, your break of ${this.settings['break-minutes']} minutes is over. Do you want to start a new pomodoro ?`,
      breakAudio: require(`file-loader!../../../audio/${this.settings['work-sound']}`), // eslint-disable-line global-require
      endAudio: require(`file-loader!../../../audio/${this.settings['break-sound']}`), // eslint-disable-line global-require
      breakCTA: 'Break',
      breakMsg: 'Work hard! Focus! Time left in the session:',
      title: 'Pomodoro',
      breakOnMsg: 'Enjoy your break! You deserve it :)!',
      breakOverMsg: 'Break is over!',
      startCTA: 'Start',
    };

    this.startSeconds = 59;

    this.state = {
      isBreak: false,
      minutes: this.settings.running ? this.settings.minutes : this.settings.countdown || 25,
      seconds: this.settings.running ? this.settings.seconds : this.startSeconds,
      running: this.settings.running,
    };

    this.initView();
  }

  initView() {
    // add event listener
    this.cta.on('click', this.handleSession.bind(this));

    if (this.state.running) {
      this.elapseTime();
      updateText(this.cta, 'Stop');
    }

    this.updateTimeDisplay(this.state.minutes, this.state.seconds);
    this.updateCurrentTime();

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
  }

  updateDigitsDisplay(time, type) {
    const digits = getTimeDigits(time);
    const [firstDigit, secondDigit] = digits;

    updateText(type === 'm' ? this.minutesFirstDigit : this.secondsFirstDigit, firstDigit);
    updateText(type === 'm' ? this.minutesSecondDigit : this.secondsSecondDigit, secondDigit);
  }

  updateTimeDisplay(minutes, seconds) {
    const displaySeconds = seconds === this.startSeconds
      && (this.state.minutes === this.settings.countdown
        || this.state.miuntes === this.settings['break-minutes'])
      && !this.state.running ? 0 : seconds;

    this.updateDigitsDisplay(minutes, 'm');
    this.updateDigitsDisplay(displaySeconds, 's');
  }

  displayBreakMsg() {
    updateText(this.messageContainer, this.config.breakMsg);
    updateText(this.statusBarTitle, this.config.title);
  }

  updateCurrentTime(newState) {
    this.updateState(newState);
    TimerController.updateSettings(newState);
  }

  elapseTime() {
    this.pomodoroInterval = setInterval(() => {
      if (this.state.seconds === 0) {
        if (this.state.minutes !== 0) {
          this.handleElapseMinutes();
        } else {
          this.handleSessionEnd();
        }
      } else {
        this.handleElapseSeconds();
      }
    }, 1000);
  }

  handleElapseSeconds() {
    this.updateCurrentTime({
      seconds: this.state.seconds - 1,
    });

    this.updateTimeDisplay(this.state.minutes, this.state.seconds);

    this.updateTitlePomodoro(this.state.minutes, this.state.seconds);
  }

  handleElapseMinutes() {
    this.updateCurrentTime({
      minutes: this.state.minutes - 1,
      seconds: this.startSeconds,
    });

    this.updateTimeDisplay(this.state.minutes, this.startSeconds);

    this.updateTitlePomodoro(this.state.minutes, this.state.seconds);
  }

  handleBreakEnd() {
    this.resetPomodoro();
    notifySessionEnd(this.config.breakEndMsg, this.config.breakEndAudio, this.config.breakOverMsg);

    updateText(this.cta, this.config.startCTA);

    this.updateCurrentTime({
      isBreak: false,
      running: false,
      minutes: this.settings.countdown,
      seconds: this.startSeconds,
    });
  }

  handleSessionEnd() {
    clearInterval(this.pomodoroInterval);
    if (!this.state.isBreak) {
      updateText(this.cta, this.config.breakCTA);
      notifySessionEnd(this.config.endMsg, this.config.endAudio, this.config.breakOnMsg);

      this.updateCurrentTime({
        seconds: this.state.break - 1,
        minutes: this.settings['break-minutes'],
      });
    } else {
      this.handleBreakEnd();
    }
  }

  resetPomodoro() {
    clearInterval(this.pomodoroInterval);
    this.displayBreakMsg();

    TimerController.updateSettings({
      minutes: this.settings.countdown,
      seconds: this.startSeconds,
    });

    this.updateTimeDisplay(this.settings.countdown, 0);
  }

  updateTitlePomodoro(minutes, seconds) {
    const min = String(minutes).length > 1 ? minutes : `0${minutes}`;
    const sec = String(seconds).length > 1 ? seconds : `0${seconds}`;

    const sessionCurrentTime = `${min}:${sec} Pomodoro`;
    updateText(this.statusBarTitle, sessionCurrentTime);
  }

  handleBreakStart() {
    this.resetPomodoro();
    updateText(this.cta, 'Stop');
    updateText(this.messageContainer, this.config.breakOnMsg);

    this.updateCurrentTime({
      isBreak: true,
      running: true,
      minutes: this.settings['break-minutes'] - 1,
      seconds: this.startSeconds,
    });

    this.elapseTime();
  }

  handleSessionStart() {
    updateText(this.cta, 'Stop');
    this.resetPomodoro();

    this.updateCurrentTime({
      running: true,
      minutes: this.state.minutes - 1,
      seconds: this.startSeconds,
    });

    this.elapseTime();
  }

  handleAnySessionEnd() {
    const stopTimer = confirm('Are you sure you want to stop the timer ?'); // eslint-disable-line no-restricted-globals, no-alert
    if (stopTimer) {
      updateText(this.cta, 'Start');
      this.resetPomodoro();
    }

    this.updateCurrentTime({
      running: false,
      isBreak: false,
      seconds: this.startSeconds,
      minutes: this.settings.countdown,
    });
  }

  handleSession() {
    const toggle = this.cta.text();

    if (toggle === 'Start') {
      this.handleSessionStart();
    } else if (toggle === 'Stop') {
      this.handleAnySessionEnd();
    } else if (toggle === 'Break') {
      this.handleBreakStart();
    }
  }
}
