import LinksController from './LinksSection/links.controller';
import TimerController from './TimerSection/timer.controller';

export default class SettingsController {
  constructor() {
    // elements
    this.container = $('.settings-widget');
    this.menuContainer = $('.settings-widget__menu');
    this.optionNames = $('.settings-widget__list div');
    this.currentSettingsView = $('.settings-widget__section');

    // sub view controllers
    this.linksController = new LinksController();
    this.timerController = new TimerController();

    // add event listeners
    this.container.on('click', this.onContainerToggle.bind(this));
    this.optionNames.on('click', this.onSelectSettings.bind(this));
    $(document).on('mouseup', this.onClickOutside.bind(this));
  }

  onContainerToggle(e) {
    if (e.target === this.container[0]) {
      this.menuContainer.toggle();
    }
  }

  displaySelectedSettings(id) {
    this.currentSettingsView.attr('style', 'display: none!important');
    const selectedSettingsOption = $(`#${id}O`);
    selectedSettingsOption.attr('style', 'display: flex!important');
  }

  onSelectSettings(e) {
    // remove previously selected settings view
    this.optionNames.removeClass('selected');

    // set current view as selected
    $(e.currentTarget).addClass('selected');

    this.displaySelectedSettings(e.currentTarget.id);
  }

  onClickOutside(e) {
    if (
      this.menuContainer.is(':visible')
            && e.target !== this.container[0]
            && e.target !== this.menuContainer[0]
            && this.menuContainer.has(e.target).length === 0
    ) {
      this.menuContainer.hide();
    }
  }
}
