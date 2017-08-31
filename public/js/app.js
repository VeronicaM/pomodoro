require("../css/app.scss");
const favIco = require("../favicon.png");
const blackCat = require("../images/black-cat.png");


$(function() {
    let settings = localStorage.getItem('pomodoroSettings'),
        location = {},
        unit = "metric",
        minutes = 0,
        seconds = 59,
        pomodoroId = "",
        isBreak = false,
        pomodoroEndMsg = "",
        breakEndMsg = "",
        pomodoroEndAudio = "",
        breakEndAudio = "",
        quoteLink = "",
        sounds = {
            "Jubilation": "jubilation.mp3",
            "Give me your attention": "attention-seeker.mp3",
            "Good Morning": "good-morning.mp3",
            "Chime": "long-chime-sound.mp3",
            "Hey you": "obey.mp3",
            "Solemn": "solemn.mp3",
            "Tic Tac": "oringz-w435.mp3"
        },
        soundsNames = swap(sounds);

    $(document).ready(function() {
        const link = $("<link></link>");
        link[0].type = 'image/x-icon';
        link[0].rel = 'shortcut icon';
        link[0].href = favIco;
        $('head')[0].append(link[0]);
        getQuote();
        getLocation();


        // $("#closeSettings").on("click",function(e){
        // 		$(".menu").hide();
        // });
        $("#closeQuote").on("click", function(e) {
            $(".quote").hide();
        });
        $("#closeWeather").on("click", function(e) {
            $(".weatherWidget").hide();
        });
        $("#start").on("click", function(e) {
            const toggle = $(this).text();
            if (toggle == "Start") {
                $(this).text("Stop");
                resetPomodoro();
                elapseTime();
            } else if (toggle == "Stop") {
                if (confirm("Are you sure you want to stop the timer ?")) {
                    $(this).text("Start");
                    resetPomodoro();
                }
            } else if (toggle == "Take Break") {
                resetPomodoro();
                $(this).text("Start");
                $(".message").text("Break Time");
                minutes = settings.break;
                elapseTime();
                isBreak = true;
            }

        });
        $(".temperature").on("click", function(e) {
            console.log($(this).text());
            var text = $(this).text();
            if (text.indexOf("C") >= 0) {
                text = text.replace("C", "F");
                unit = "imperial";
                getWeather();
            } else {
                text = text.replace("F", "C");
                unit = "metric";
                getWeather();
            }
            $(this).text(text);
        });
        $(".settings").on("click", function(e) {
            if (e.target == $(".settings")[0]) {
                $(".menu").toggle();
            }
        });
        $(".quoteTrigger").on("click", function(e) {
            if (e.target == $(".quoteTrigger")[0]) {
                $(".quote").toggle();
            }
        });
        $(".weatherTrigger").on("click", function(e) {
            if (e.target == $(".weatherTrigger")[0]) {
                $(".weatherWidget").toggle();
            }
        });
        $(".settings-list div").on("click", function(e) {
            $(".settings-list div").removeClass("selected");
            $(this).addClass("selected");
            setSelectedSettings();
        });
        $(".timerSetting").change(function(e) {
            let newOption = {},
                key = this.id,
                value = "";
            if (key.indexOf("S") > 0) {
                value = sounds[this.value];
            } else { value = this.value; }
            newOption[key] = value;
            updateStore(newOption);
            initializeValues();
        });
        $(".quote").hover(function(e) {
            $(".shareQ").addClass("animateQuote");
        });
        $(".quote").mouseleave(function(e) {
            $(".shareQ").removeClass("animateQuote");
        });
        $("#twitter").click(function() {
            let textToTweet = $(".text").text() + " by " + $(".author").text();
            if (textToTweet.length >= 140) {
                textToTweet = textToTweet.substring(0, 70) + '... by ' + $(".author").text() + " " + quoteLink;
            }
            var twtLink = 'http://twitter.com/home?status=' + encodeURIComponent(textToTweet);
            window.open(twtLink, '_blank');
        });
    });

    function loadStore() {
        let oldSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
        let newSettings = {
            'break': oldSettings.break || '5',
            'countdown': oldSettings.countdown || '25',
            'breakSound': oldSettings.breakSound || 'good-morning.mp3',
            'workSound': oldSettings.workSound || 'attention-seeker.mp3'
        };
        settings = newSettings;
        localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    }

    function updateStore(option) {
        let oldSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
        let newSettings = Object.assign({}, oldSettings, option);
        settings = newSettings;
        localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    }

    function initializeValues() {
        pomodoroEndAudio = require("file-loader!../audio/" + settings.breakSound);
        breakEndAudio = require("file-loader!../audio/" + settings.workSound);
        minutes = settings.countdown;
        pomodoroEndMsg = "Hey, your pomodoro session of " + settings.countdown + " minutes is over ! Come take a break and cross out your finished tasks !";
        breakEndMsg = "Hey, your break of " + settings.break+" minutes is over. Do you want to start a new pomodoro ?";
        setTimeMinutes(minutes);
        setStoredTimerSettings();
        setSelectedSettings();
    }

    function setSelectedSettings() {
        $(".partialSetting").attr('style', 'display: none!important');
        let selectedSetting = $("#" + $(".settings-list .selected")[0].id + "O");
        selectedSetting.attr('style', 'display: block!important');
    }

    function setStoredTimerSettings() {
        $("#countdown").val(settings.countdown);
        $("#break").val(settings.break);
        $("#breakSound").val(soundsNames[settings.breakSound]);
        $("#workSound").val(soundsNames[settings.workSound]);
    }
    $(document).on("mouseup", function(e) {
        if ($(".menu").is(":visible") && e.target !== $(".settings")[0] && e.target !== $(".menu")[0] && $(".menu").has(e.target).length === 0) {
            $(".menu").hide();
        }
    });
    // request permission on page load
    window.onload = function() {
        loadStore();
        initializeValues();
        if (Notification.permission !== "granted")
            Notification.requestPermission();
    };

    function notifySessionEnd(message, audioN, title) {
        let audio = new Audio(audioN);
        audio.play();
        if (Notification.permission == "granted") {

            let notification = new Notification(title, {
                icon: blackCat,
                body: message,
            });

            notification.addEventListener('click', function(e) {
                window.focus();
                e.target.close();
            }, false);
        }


    }

    function resetPomodoro() {
        minutes = settings.countdown;
        seconds = 59;
        $(".message").text("Time until break");
        $("title").text("Pomodoro");
        clearInterval(pomodoroId);
        setTimeMinutes(minutes);
        setTimeSeconds(0);
    }

    function setTimeMinutes(timeV) {
        const minutes = timeV.toString().length > 1 ? timeV.toString().split("") : ("0" + timeV.toString()).split("");
        $("time div:nth-of-type(1) span").text(minutes[0]);
        $("time div:nth-of-type(2) span").text(minutes[1]);
    }

    function setTimeSeconds(timeV) {
        const seconds = timeV.toString().length > 1 ? timeV.toString().split("") : ("0" + timeV.toString()).split("");

        $("time div:nth-of-type(4) span").text(seconds[0]);
        $("time div:nth-of-type(5) span").text(seconds[1]);
    }

    function elapseTime() {
        minutes--;
        setTimeMinutes(minutes);
        setTimeSeconds(seconds);
        pomodoroId = setInterval(function() {
            //$("time div:nth-of-type(2) span").removeClass("runAnimation");	
            if (seconds == 0) {
                if (minutes != 0) {
                    minutes--;
                    setTimeMinutes(minutes);
                    seconds = 59;
                    //  	animateDigit();
                } else {
                    //console.log("finished countdown",seconds,minutes);
                    clearInterval(pomodoroId);

                    if (!isBreak) {
                        $("#start").text("Take Break");
                        notifySessionEnd(pomodoroEndMsg, pomodoroEndAudio, "Break time");

                    } else {
                        resetPomodoro();
                        notifySessionEnd(breakEndMsg, breakEndAudio, "Break is over");
                        isBreak = false;
                    }

                }
            } else {
                seconds--;
                setTimeSeconds(seconds);
                updateTitlePomodoro();
            }
        }, 1000);
    }

    function animateDigit() {
        $("time div:nth-of-type(2) span").addClass("runAnimation");
    }

    function updateTitlePomodoro() {
        const min = minutes.toString().length > 1 ? minutes : "0" + minutes;
        const sec = seconds.toString().length > 1 ? seconds : "0" + seconds;
        $("title").text(min + ":" + sec + " Pomodoro");
    }

    function swap(json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    }

    function getQuote() {
        $.getJSON('/quote', function(quote) {
            quoteLink = quote.quoteLink;
            let author = quote.quoteAuthor || "Unknown";
            $(".text").text('" ' + quote.quoteText + ' "');
            $(".author").text(author);
        });
    }

    function getLocation() {
        $.get("https://ipinfo.io", function(data) {
            //	console.log('location data',data);
            location.lat = data.loc.split(",")[0];
            location.lon = data.loc.split(",")[1];
            location.city = data.city;
            location.country = data.country;
            getWeather();
        }, "jsonp");
    }


    function getWeather(query) {
        var data = { "lat": location.lat, "lon": location.lon, "units": unit };
        $.post('/weather', { "lat": location.lat, "lon": location.lon, "units": unit }).done(function(wResult) {
            let data = {
                temp: Math.round(wResult.main.temp),
                description: wResult.weather[0].description,
                imgURL: "http://openweathermap.org/img/w/" + wResult.weather[0].icon + ".png",
            }
            var unitSymbol = unit == "metric" ? "C" : "F";
            $(".weatherIco").attr("src", data.imgURL);
            $(".weatherInfo span:first-of-type").text(data.temp + " " + String.fromCharCode(176) + " " + unitSymbol);
            $(".descriptionText").text(data.description);
            $(".location").text(location.city + ", " + location.country);
        });
    }
});