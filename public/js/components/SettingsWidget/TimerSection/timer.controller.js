
// helpers
import { swap } from '../../../common/utils';

const sounds = {
  Jubilation: 'jubilation.mp3',
  'Give me your attention': 'attention-seeker.mp3',
  'Good Morning': 'good-morning.mp3',
  Chime: 'long-chime-sound.mp3',
  'Hey you': 'obey.mp3',
  Solemn: 'solemn.mp3',
  'Tic Tac': 'oringz-w435.mp3',
};

export default class TimerController {
  constructor() {
    // settings options
    this.pomodoroSessionTime = $('#js-countdown');
    this.breakTime = $('#js-break-minutes');
    this.breakSound = $('#js-break-sound');
    this.workSound = $('#js-work-sound');
    this.settingsOption = $('.settings-widget-timer__option');

    // state
    this.soundNames = swap(sounds);

    this.initView();
  }

  initView() {
    this.settings = TimerController.getSettings();

    this.renderSettings();

    // add event listeners
    this.settingsOption.change(this.onSettingsChange.bind(this));
  }

  updateState(newState) {
    this.state = { ...this.state, newState };
  }

  renderSettings() {
    this.pomodoroSessionTime.val(this.settings.countdown);
    this.breakTime.val(this.settings['break-minutes']);
    this.breakSound.val(this.soundNames[this.settings['break-sound']]);
    this.workSound.val(this.soundNames[this.settings['work-sound']]);
  }

  static getSettings() {
    const storedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};

    const settings = {
      'break-minutes': storedSettings['break-minutes'] || '5',
      countdown: storedSettings.countdown || '25',
      'break-sound': storedSettings['break-sound'] || 'good-morning.mp3',
      'work-sound': storedSettings['work-sound'] || 'attention-seeker.mp3',
      minutes: storedSettings.minutes || storedSettings.countdown || '25',
      seconds: storedSettings.seconds || 59,
      running: storedSettings.running || false,
      isBreak: storedSettings.isBreak || false,
    };

    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));

    return settings;
  }

  static updateSettings(option) {
    const settings = JSON.parse(localStorage.getItem('pomodoroSettings') || {});
    const updatedSettings = { ...settings, ...option };
    localStorage.setItem('pomodoroSettings', JSON.stringify(updatedSettings));
    this.settings = updatedSettings;
  }

  // eslint-disable-line class-methods-use-this
  onSettingsChange(e) {
    const getCleanId = (id) => id.replace('js-', '');

    const newOption = {};
    const key = getCleanId(e.currentTarget.getAttribute('id'));
    let value = '';
    if (key.indexOf('sound') > 0) {
      value = sounds[e.currentTarget.value];
    } else {
      value = e.currentTarget.value;
    }

    newOption[key] = value;
    TimerController.updateSettings(newOption);
  }
}
