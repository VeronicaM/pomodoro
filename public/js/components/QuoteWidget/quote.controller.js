// services
import { buildURL } from '../../services/endpoint.service';
import { updateText } from '../../common/utils';

const getQuote = () => {
  const URL = buildURL('GET_QUOTE');

  return new Promise((resolve) => {
    $.post(URL).done((quote) => {
      const result = JSON.parse(quote);
      resolve({
        author: result.quoteAuthor || 'Unknown',
        text: result.quoteText,
      });
    });
  });
};

const onTweet = () => {
  let textToTweet = `${$('.text').text()} by ${$('.author').text()}`;
  if (textToTweet.length >= 140) {
    textToTweet = `${textToTweet.substring(0, 70)}... by ${$(
      '.author',
    ).text()}`;
  }
  const twtLink = `http://twitter.com/home?status=${encodeURIComponent(
    textToTweet,
  )}`;
  window.open(twtLink, '_blank');
};

export default class QuoteController {
  constructor() {
    // elements
    this.label = $('.quote-widget__text');
    this.author = $('.quote-widget__author');
    this.closeBtn = $('#closeQuote');
    this.twitterIcon = $('#twitter');
    this.container = $('.quote-widget');
    this.containerToggle = $('.quote-widget__trigger');
    this.shareContainer = $('.quote-widget__shareQ');

    this.initView();
  }

  initView() {
    const onGetQuote = (quote) => {
      this.displayQuote(quote);
      this.addEventListeners();
    };

    getQuote().then(onGetQuote.bind(this));
  }

  displayQuote({ text, author }) {
    updateText(this.label, `" ${text} "`);
    updateText(this.author, author);
  }

  addEventListeners() {
    // click events
    this.containerToggle.on('click', this.onContainerToggle.bind(this));
    this.closeBtn.on('click', this.onCloseContainer.bind(this));
    this.twitterIcon.click(onTweet);

    // hover events
    this.container.hover(this.onHoverIn.bind(this));
    this.container.mouseleave(this.onHoverOut.bind(this));
  }

  onCloseContainer() {
    this.container.hide();
  }

  onContainerToggle(e) {
    if (e.target === this.containerToggle[0]) {
      this.container.toggle();
    }
  }

  onHoverIn() {
    this.shareContainer.addClass('animateQuote');
  }

  onHoverOut() {
    this.shareContainer.removeClass('animateQuote');
  }
}
