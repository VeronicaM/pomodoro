require("../css/app.scss");
require("../vendor/countdown-plugin/timeTo.css");
require("../vendor/countdown-plugin/jquery.time-to.min.js");
$(function () 
 { 
 	let countdown = 25, minute= 60000, seconds=10000;
 $(document).ready(function(){
       $('#demo').timeTo(60000, function(){
        alert('Countdown finished');
    });
       setTimeMinutes(countdown);
      
	   $("#start").on("click",function(e){
 			   countdown--;
 			    setTimeMinutes(countdown);
 			    setTimeSeconds(59);
 			  //  setInterval(function(){
		    //   	  minute--;
			   // },1000);	
	   });
 });
	 function setTimeMinutes(timeV){
	 	const minutes = timeV.toString().length >1 ? timeV.toString().split(""): ("0"+timeV.toString()).split("");
	 	$("time span:nth-of-type(1)").text(minutes[0]);
	 	$("time span:nth-of-type(2)").text(minutes[1]);
	 }
	 function setTimeSeconds(timeV){
	 	const seconds = timeV.toString().length >1 ? timeV.toString().split(""): ("0"+timeV.toString()).split("");
	 	$("time span:nth-of-type(4)").text(seconds[0]);
	 	$("time span:nth-of-type(5)").text(seconds[1]);
	 }
	 function countDown(){
         
	 }
});
