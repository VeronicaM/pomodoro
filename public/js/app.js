require("../css/app.scss");
const favIco =require("../favicon.png");
$(function () 
 { 
 	let countdown = 2, 
 		settings={seconds:5,minutes:countdown,break:1}, 
 		minutes= settings.minutes, 
 		seconds=settings.seconds,
 		pomodoroId="",
 		isBreak=false;
 $(document).ready(function(){
       const link = $("<link></link>");
	    link[0].type = 'image/x-icon';
	    link[0].rel = 'shortcut icon';
	    link[0].href = favIco;
	    $('head')[0].append(link[0]);
       setTimeMinutes(countdown);
      
	   $("#start").on("click",function(e){
	   	 const toggle = $(this).text();
	   		if(toggle=="Start"){
	   			$(this).text("Stop");
	   			resetPomodoro();
 			    elapseTime();	
	   		}else if(toggle == "Stop"){
	   			if(confirm("Are you sure you want to stop the timer ?")){
	   				$(this).text("Start");
	   				resetPomodoro();
	   			}
	   		}
	   		else if(toggle == "Take Break"){
	   			resetPomodoro();
	   			$(this).text("Start");
	   			$(".message").text("Break Time");
	   			minutes=settings.break;
 			    elapseTime();
 			    isBreak = true;
	   		}
	   		
	   });
 });
     function resetPomodoro(){
     	minutes = settings.minutes;
     	seconds = settings.seconds;
     	 $(".message").text("Time until break"); 
     	 $("title").text("Pomodoro");
     	clearInterval(pomodoroId);
     	setTimeMinutes(minutes);
	    setTimeSeconds(0);
     }
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
			    pomodoroId = setInterval(function(){
			      //$("time div:nth-of-type(2) span").removeClass("runAnimation");	
		       	  if(seconds==0){
		       	  	if(minutes!=0){
		       	  	   minutes--;
		       	  	   setTimeMinutes(minutes);
		       	  	   seconds=settings.seconds;
		       	  	//  	animateDigit();
		       	  	}else{
		       	  		//console.log("finished countdown",seconds,minutes);
		       	  		clearInterval(pomodoroId);
		       	  		
		       	  		if(!isBreak){
		       	  		  $("#start").text("Take Break");		
		       	  		}
		       	  		else{
		       	  			resetPomodoro();
		       	  			isBreak= false;	
		       	  		} 
		       	  		
		       	  	}
		       	  }else{
		       	  		seconds--;
	       	        	setTimeSeconds(seconds);
	       	        	 updateTitlePomodoro();
		       	  }
		       	
	       	    
	       	  	
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
