import { Link } from './links.js';
import { Task } from './task.js';
import {
  getLinks,
  removeLink,
  saveLink,
  saveTask,
  getTasks,
  removeTask,
  completeTask,
} from './repository.js';

require('../css/app.scss');
const favIco = require('../favicon.png');
const blackCat = require('../images/black-cat.png');

$(() => {
  let settings = localStorage.getItem('pomodoroSettings');
  const location = {};
  let unit = 'metric';
  let minutes = 0;
  let seconds = 59;
  let pomodoroId = '';
  let isBreak = false;
  let pomodoroEndMsg = '';
  let breakEndMsg = '';
  let pomodoroEndAudio = '';
  let breakEndAudio = '';
  let running = false;
  let links = [];
  let tasks = [];
  const sounds = {
    Jubilation: 'jubilation.mp3',
    'Give me your attention': 'attention-seeker.mp3',
    'Good Morning': 'good-morning.mp3',
    Chime: 'long-chime-sound.mp3',
    'Hey you': 'obey.mp3',
    Solemn: 'solemn.mp3',
    'Tic Tac': 'oringz-w435.mp3',
  };
  const soundsNames = swap(sounds);

  $(document).ready(() => {
    // add favicon to html header
    const linkValue = new Link({});
    const link = $('<link></link>');
    link[0].type = 'image/x-icon';
    link[0].rel = 'shortcut icon';
    link[0].href = favIco;
    $('head')[0].append(link[0]);
    // retrieve and display quotes and weather
    getQuote();
    getLocation();

    // toggle Celcius/ Farenheit

    $('.temperature').on('click', function (e) {
      let text = $(this).text();
      if (text.indexOf('C') >= 0) {
        text = text.replace('C', 'F');
        unit = 'imperial';
        getWeather();
      } else {
        text = text.replace('F', 'C');
        unit = 'metric';
        getWeather();
      }
      $(this).text(text);
    });

    // add clickListeners for gadgets
    $('#closeQuote').on('click', (e) => {
      $('.quote').hide();
    });

    $('#closeWeather').on('click', (e) => {
      $('.weatherWidget').hide();
    });

    $('.settings').on('click', (e) => {
      if (e.target == $('.settings')[0]) {
        $('.menu').toggle();
      }
    });
    $('.quoteTrigger').on('click', (e) => {
      if (e.target == $('.quoteTrigger')[0]) {
        $('.quote').toggle();
      }
    });
    $('.taskTrigger').on('click', (e) => {
      if (e.target == $('.taskTrigger')[0]) {
        $('.taskWidget').toggle();
      }
    });
    $('.weatherTrigger').on('click', (e) => {
      if (e.target == $('.weatherTrigger')[0]) {
        $('.weatherWidget').toggle();
      }
    });
    $('.settings-list div').on('click', function (e) {
      $('.settings-list div').removeClass('selected');
      $(this).addClass('selected');
      setSelectedSettings();
    });
    $('#addLink').on('click', (e) => {
      const title = $('#linkTitle').val();
      $('#linkTitle').val('');
      const link = $('#linkValue').val();
      $('#linkValue').val('');
      if (title !== '' && link !== '') {
        const newLink = new Link({ title, link, defaultLink: false });
        saveLink(newLink);
        const appendDelete = `<td class='deleteLink' data-linkValue='${JSON.stringify(
          newLink,
        )}'> X </td>`;
        const content = `<tr><td>${title}</td><td><a href='${link}'>${link}</a></td>${appendDelete}</tr>`;
        $('#links table').append(content);
        $('.deleteLink').on('click', (e) => {
          const attributeContent = e.currentTarget.getAttribute(
            'data-linkValue',
          );
          const object = JSON.parse(attributeContent);
          removeLink(object);
          links = getLinks();
          printLinks();
        });
      }
    });
    // show quote author and add twitter sharing action

    $('.quote').hover((e) => {
      $('.shareQ').addClass('animateQuote');
    });

    $('.quote').mouseleave((e) => {
      $('.shareQ').removeClass('animateQuote');
    });

    $('#twitter').click(() => {
      let textToTweet = `${$('.text').text()} by ${$('.author').text()}`;
      if (textToTweet.length >= 140) {
        textToTweet = `${textToTweet.substring(0, 70)}... by ${$(
          '.author',
        ).text()} ${quoteLink}`;
      }
      const twtLink = `http://twitter.com/home?status=${encodeURIComponent(
        textToTweet,
      )}`;
      window.open(twtLink, '_blank');
    });

    $('#taskName').keypress((e) => {
      const key = e.which;
      if (key == 13) {
        // the enter key code
        const newTask = new Task({
          description: e.currentTarget.value,
          completed: false,
        });
        saveTask(newTask);
        printTask(newTask);
        e.currentTarget.value = '';
      }
    });

    function printTask(task) {
      const appendDelete = `<span class='deleteTask' data-taskValue='${JSON.stringify(
        task,
      )}'> x </span>`;
      const className = task.completeTask ? 'strikeText' : '';
      const content = `<label class='${className}'><input taskValue='${JSON.stringify(
        task,
      )}' class='taskCheckbox' type ='checkbox' value ='${task.description}'> ${
        task.description
      }${appendDelete}</label>`;
      $('.tasks').append(content);

      $('.deleteTask').on('click', (e) => {
        const attributeContent = e.currentTarget.getAttribute('data-taskValue');
        const object = JSON.parse(attributeContent);
        removeTask(object);
        tasks = getTasks();
        printTasks();
      });

      $('.taskCheckbox').change(function (e) {
        const attributeContent = e.currentTarget.getAttribute('taskValue');
        const object = JSON.parse(attributeContent);
        if (this.checked) {
          this.parentElement.className = 'strikeText';
          object.completed = true;
        } else {
          this.parentElement.className = '';
          object.completed = false;
        }
        completeTask(object);
      });
    }

    // click Listener for Pomodoro button
    $('#start').on('click', function (e) {
      const toggle = $(this).text();

      if (toggle == 'Start') {
        $(this).text('Stop');
        resetPomodoro();
        running = true;
        minutes--;
        elapseTime();
      } else if (toggle == 'Stop') {
        if (confirm('Are you sure you want to stop the timer ?')) {
          $(this).text('Start');
          resetPomodoro();
        }
        running = false;
        isBreak = false;
        storeCurrentTime(minutes, seconds, running, isBreak);
      } else if (toggle == 'Break') {
        resetPomodoro();
        $(this).text('Stop');
        $('.message').text('Break Time');
        minutes = settings.break;
        isBreak = true;
        running = true;
        minutes--;
        elapseTime();
      }
      storeCurrentTime(minutes, seconds, running, isBreak);
    });

    $('.timerSetting').change(function (e) {
      const newOption = {};
      const key = this.id;
      let value = '';
      if (key.indexOf('S') > 0) {
        value = sounds[this.value];
      } else {
        value = this.value;
      }
      newOption[key] = value;
      updateStore(newOption);
      initializeValues();
    });
  });

  function loadStore() {
    const oldSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    const newSettings = {
      break: oldSettings.break || '5',
      countdown: oldSettings.countdown || '25',
      breakSound: oldSettings.breakSound || 'good-morning.mp3',
      workSound: oldSettings.workSound || 'attention-seeker.mp3',
      running: oldSettings.running || false,
      minutes:
        oldSettings.minutes !== null
          ? oldSettings.minutes
          : oldSettings.countdown !== null
            ? oldSettings.countdown
            : '25',
      seconds: oldSettings.seconds || '00',
      isBreak: oldSettings.isBreak || false,
    };
    settings = newSettings;
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    links = getLinks();
    tasks = getTasks();
    printLinks();
    printTasks();
  }

  function updateStore(option) {
    const oldSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
    const newSettings = { ...oldSettings, ...option };
    settings = newSettings;
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
  }

  function storeCurrentTime(minutes, seconds, running, isBreak) {
    updateStore({ minutes });
    updateStore({ seconds });
    updateStore({ running });
    updateStore({ isBreak });
  }

  function initializeValues() {
    pomodoroEndAudio = require(`file-loader!../audio/${settings.breakSound}`);
    breakEndAudio = require(`file-loader!../audio/${settings.workSound}`);
    minutes = settings.running ? settings.minutes : settings.countdown;
    seconds = settings.running ? settings.seconds : '00';
    isBreak = settings.isBreak || false;
    running = settings.running;
    pomodoroEndMsg = `Hey, your pomodoro session of ${settings.countdown} minutes is over ! Come take a break and cross out your finished tasks !`;
    breakEndMsg = `Hey, your break of ${settings.break} minutes is over. Do you want to start a new pomodoro ?`;
    const message = isBreak ? 'Break time' : 'Time until break';
    $('.message').text(message);
    setTimeMinutes(minutes);
    setTimeSeconds(seconds);
    setStoredTimerSettings();
    setSelectedSettings();
  }

  function setSelectedSettings() {
    $('.partialSetting').attr('style', 'display: none!important');
    const selectedSetting = $(`#${$('.settings-list .selected')[0].id}O`);
    selectedSetting.attr('style', 'display: block!important');
  }

  function setStoredTimerSettings() {
    $('#countdown').val(settings.countdown);
    $('#break').val(settings.break);
    $('#breakSound').val(soundsNames[settings.breakSound]);
    $('#workSound').val(soundsNames[settings.workSound]);
  }

  $(document).on('mouseup', (e) => {
    if (
      $('.menu').is(':visible')
      && e.target !== $('.settings')[0]
      && e.target !== $('.menu')[0]
      && $('.menu').has(e.target).length === 0
    ) {
      $('.menu').hide();
    }
  });
  // request permission on page load
  window.onload = function () {
    loadStore();
    initializeValues();
    if (running) {
      elapseTime();
      $('#start').text('Stop');
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  function notifySessionEnd(message, audioN, title) {
    const audio = new Audio(audioN);
    audio.play();
    if (Notification.permission == 'granted') {
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
  }

  function resetPomodoro() {
    minutes = settings.countdown;
    seconds = 59;
    $('.message').text('Time until break');
    $('title').text('Pomodoro');
    clearInterval(pomodoroId);
    setTimeMinutes(minutes);
    setTimeSeconds(0);
  }

  function setTimeMinutes(timeV) {
    const minutes = timeV.toString().length > 1
      ? timeV.toString().split('')
      : `0${timeV.toString()}`.split('');
    $('time div:nth-of-type(1) span').text(minutes[0]);
    $('time div:nth-of-type(2) span').text(minutes[1]);
  }

  function setTimeSeconds(timeV) {
    const seconds = timeV.toString().length > 1
      ? timeV.toString().split('')
      : `0${timeV.toString()}`.split('');

    $('time div:nth-of-type(4) span').text(seconds[0]);
    $('time div:nth-of-type(5) span').text(seconds[1]);
  }

  function elapseTime() {
    setTimeMinutes(minutes);
    setTimeSeconds(seconds);
    pomodoroId = setInterval(() => {
      if (seconds == 0) {
        if (minutes != 0) {
          minutes--;
          setTimeMinutes(minutes);
          seconds = 59;
          setTimeSeconds(seconds);
        } else {
          clearInterval(pomodoroId);
          if (!isBreak) {
            $('#start').text('Break');
            notifySessionEnd(pomodoroEndMsg, pomodoroEndAudio, 'Break time');
          } else {
            resetPomodoro();
            notifySessionEnd(breakEndMsg, breakEndAudio, 'Break is over');
            $('#start').text('Start');
            isBreak = false;
          }
        }
      } else {
        seconds--;
        setTimeSeconds(seconds);
        updateTitlePomodoro();
      }
      storeCurrentTime(minutes, seconds, running, isBreak);
    }, 1000);
  }

  function printLinks() {
    let content = '<table>';
    let appendDelete = '';
    for (let i = 0; i < links.length; i++) {
      if (!links[i].defaultLink) {
        appendDelete = `<td class='deleteLink' data-linkValue='${JSON.stringify(
          links[i],
        )}'> X </td>`;
      }
      content += `<tr><td>${links[i].title}</td><td><a href='${links[i].link}'>${links[i].link}</a></td>${appendDelete}</tr>`;
    }
    content += '</table>';
    $('#links').empty();
    $('#links').append(content);
    $('.deleteLink').on('click', (e) => {
      const attributeContent = e.currentTarget.getAttribute('data-linkValue');
      const object = JSON.parse(attributeContent);
      removeLink(object);
      links = getLinks();
      printLinks();
    });
  }

  function printTasks() {
    let content = '';
    let appendDelete = '';
    let className = '';
    let checked = '';
    for (let i = 0; i < tasks.length; i++) {
      appendDelete = `<span class='deleteTask' data-taskValue='${JSON.stringify(
        tasks[i],
      )}'> x </span>`;
      if (tasks[i].completed) {
        className = 'strikeText';
        checked = 'checked';
      }
      content += `<label class='${className}'><input taskValue='${JSON.stringify(
        tasks[i],
      )}' class='taskCheckbox' type ='checkbox' ${checked} value ='${
        tasks[i].description
      }'> ${tasks[i].description}${appendDelete}</label>`;
      className = '';
      checked = '';
    }

    $('.tasks').empty();
    $('.tasks').append(content);
    $('.deleteTask').on('click', (e) => {
      const attributeContent = e.currentTarget.getAttribute('data-taskValue');
      const object = JSON.parse(attributeContent);
      removeTask(object);
      tasks = getTasks();
      printTasks();
    });
    $('.taskCheckbox').change(function (e) {
      const attributeContent = e.currentTarget.getAttribute('taskValue');
      const object = JSON.parse(attributeContent);

      if (this.checked) {
        this.parentElement.className = 'strikeText';
        object.completed = true;
      } else {
        this.parentElement.className = '';
        object.completed = false;
      }
      completeTask(object);
    });
  }

  function updateTitlePomodoro() {
    const min = minutes.toString().length > 1 ? minutes : `0${minutes}`;
    const sec = seconds.toString().length > 1 ? seconds : `0${seconds}`;
    $('title').text(`${min}:${sec} Pomodoro`);
  }

  function swap(json) {
    const ret = {};
    for (const key in json) {
      ret[json[key]] = key;
    }
    return ret;
  }

  function getQuote() {
    $.getJSON('/quote', (quote) => {
      const author = quote.quoteAuthor || 'Unknown';
      $('.text').text(`" ${quote.quoteText} "`);
      $('.author').text(author);
    });
  }

  function getLocation() {
    $.get(
      `https://ipinfo.io?token=${process.env.IP_INFO_TOKEN}`,
      (data) => {
        location.lat = data.loc.split(',')[0];
        location.lon = data.loc.split(',')[1];
        location.city = data.city;
        location.country = data.country;
        getWeather();
      },
      'jsonp',
    );
  }

  function getWeather(query) {
    const data = { lat: location.lat, lon: location.lon, units: unit };
    $.post('/weather', {
      lat: location.lat,
      lon: location.lon,
      units: unit,
    }).done((wResult) => {
      const data = {
        temp: Math.round(wResult.main.temp),
        description: wResult.weather[0].description,
        imgURL: `http://openweathermap.org/img/w/${wResult.weather[0].icon}.png`,
      };
      const unitSymbol = unit == 'metric' ? 'C' : 'F';
      $('.weatherIco').attr('src', data.imgURL);
      $('.weatherInfo span:first-of-type').text(
        `${data.temp} ${String.fromCharCode(176)} ${unitSymbol}`,
      );
      $('.descriptionText').text(data.description);
      $('.location').text(`${location.city}, ${location.country}`);
    });
  }
});
