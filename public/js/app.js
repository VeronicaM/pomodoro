require("../css/app.scss");
const favIco =require("../favicon.png");
$(function () 
 { 
 	let countdown = 25, settings={seconds:59,minutes:countdown}, minutes= settings.minutes, seconds=settings.seconds;
 $(document).ready(function(){
       const link = $("<link></link>");
	    link[0].type = 'image/x-icon';
	    link[0].rel = 'shortcut icon';
	    link[0].href = favIco;
	    $('head')[0].append(link[0]);
       setTimeMinutes(countdown);
      
	   $("#start").on("click",function(e){
 			 elapseTime();
	   });
 });
	 function setTimeMinutes(timeV){
	 	const minutes = timeV.toString().length >1 ? timeV.toString().split(""): ("0"+timeV.toString()).split("");
	 	$("time div:nth-of-type(1) span").text(minutes[0]);
	 	$("time div:nth-of-type(2) span").text(minutes[1]);
	 }
	 function setTimeSeconds(timeV){
	 	const seconds = timeV.toString().length >1 ? timeV.toString().split(""): ("0"+timeV.toString()).split("");
	 	
	 	$("time div:nth-of-type(4) span").text(seconds[0]);
	 	$("time div:nth-of-type(5) span").text(seconds[1]);
	 }
	 function elapseTime(){
               minutes--;
			    setTimeMinutes(minutes);
			    setTimeSeconds(seconds);
			    const countdownId = setInterval(function(){
			      //$("time div:nth-of-type(2) span").removeClass("runAnimation");	
		       	  if(seconds==0){
		       	  	if(minutes!=0){
		       	  	   minutes--;
		       	  	   setTimeMinutes(minutes);
		       	  	   seconds=settings.seconds;
		       	  	//  	animateDigit();
		       	  	}else{
		       	  		console.log("finished countdown",seconds,minutes);
		       	  		clearInterval(countdownId);
		       	  	}
		       	  }else{
		       	  		seconds--;
	       	        	setTimeSeconds(seconds);
		       	  }
		       	
	       	     updateTitlePomodoro();
	       	  	
		    },1000);	
	 }
	 function animateDigit(){
	 	 $("time div:nth-of-type(2) span").addClass("runAnimation");
	 }
	 function updateTitlePomodoro(){
	 	 const min = minutes.toString().length > 1 ? minutes:"0"+minutes;
	 	 const sec = seconds.toString()	.length > 1 ?seconds:"0"+seconds;
	 	 $("title").text(min+":"+sec+" Pomodoro");
	 }
});
