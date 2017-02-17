let settings= localStorage.getItem('pomodoroSettings'), 
 		minutes= 0,
 		seconds=59,
 		pomodoroId="",
 		isBreak=false,
 		pomodoroEndMsg ="",
 		breakEndMsg ="",
		pomodoroEndAudio = "",
        breakEndAudio = "",
        quoteLink="",
        sounds={
        "Jubilation":"jubilation.mp3",
        "Give me your attention":"attention-seeker.mp3",
        "Good Morning":"good-morning.mp3",
        "Chime":"long-chime-sound.mp3",
        "Hey you":"obey.mp3",
        "Solemn":"solemn.mp3",
        "Tic Tac":"oringz-w435.mp3"}, soundsNames =swap(sounds);  

   