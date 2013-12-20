//it contains user_id after authentication
var user_id = -1;

//it contains the day currently viewed in calendar
var current_day = "";

//it contains the left link day
var left_date = "";
//it contains the right link day
var right_date = "";

//it contains the lessons currently viewed
var current_lesson_id = -1;

var loading_visible = 0;

//to avoid a bug with back button in android
$(document).bind("mobileinit", function(){ 
        $.mobile.pushStateEnabled = false; 
});
/*
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady(){

}
*/

/*
function onLoad() {

	document.addEventListener("deviceready", function() {
		document.addEventListener("backbutton", function() {
			if ($.mobile.activePage.attr('id') == "lesson") {
				backClicked();
			} else {
				closeClicked();
			}
		}, false);
	}, false);
}
*/

 $(document).on('pagebeforeshow', '#home', function(){
 
	//alert("Executing #home pagebeforeshow");
 
	var username = window.localStorage.getItem("user");
	var password = window.localStorage.getItem("pw");
	
	//alert("User: "+username);
	//alert("Pass: "+password);
	
	if(username!=null && password!=null){
		$("#username_form").val(""+username);
		$("#password_form").val(""+password);
	}else{
		$("#username_form").val("");
		$("#password_form").val("");
	}
});


 // ****** home logics ******
 function authenticateCall(){
 
			current_day = ""; //re-initialize current day, just in case of logout than login without exit from app
 
			var form_values=$("#login_form").serialize();
			//alert(form_values);
			
			$.mobile.loading( 'show', { theme: 'a', text: 'autenticazione in corso...', textVisible: true } );
		
			$.ajax({
				type: "POST",
				url: "http://www.lotofit.it/lotoapp_mobile/authenticate.php",
				dataType: "json",
				data: form_values,
				success    : function(data) {
				
					$.mobile.loading( 'hide' );
				
					user_id = data["user"];
					
					if(data["user"]=="-1"){
						$("#login_form_warning").html("Attenzione: username o password sono errati. Riprova.");
					}else{
					
						var checked = $("#remember").is(":checked");
						//alert("Checked: "+checked);
					
						if(checked){
						
							//alert("checkbox is checked");
						
							var username = $("#username_form").val();
							var password = $("#password_form").val();
							
							//alert("U: "+username);
							//alert("P: "+password);
							
							window.localStorage.setItem("user", ""+username);
							window.localStorage.setItem("pw", ""+password);
						}else{
						
							//alert("checkbox is NOT checked");
						
							window.localStorage.removeItem("user");
							window.localStorage.removeItem("pw");
						}
						
						$.mobile.changePage( "#calendar", {
							changeHash: true,
							transition: "pop" 
						});
					}
				},
				error: function(xhr, status, error) {
				  $.mobile.loading( 'hide' );
				  alert("Impossibile contattare il server: riprova più tardi...");
				}
			});
			
			return false;
 }
 
  // ****** calendar logics ******
 function loadCalendar( user, day){
 
	var input_data = "user_id="+user;
	if(day!=""){
		input_data+="&date="+day;
	}
	//alert(input_data);
	
	$.mobile.loading( 'show', { theme: 'a', text: 'caricamento in corso...', textVisible: true } );
	

	$.ajax({
			type: "POST",
			url: "http://www.lotofit.it/lotoapp_mobile/getDayCourses.php",
			dataType: "json",
			data: input_data,
			success    : function(data) {
				
				//update lessons container
				$("#bottom_container_calendar").empty();
				for(var i in data['lessons']){
					var seats_string = "";
					if(data['lessons'][i]["count"]!=""){
						seats_string = data['lessons'][i]["count"]+"/"+data['lessons'][i]["seats"];
					}
					$("#bottom_container_calendar").append(
					"<a class='lesson_link' href='"+data['lessons'][i]["id"]+"' onclick='return lessonClicked("+data['lessons'][i]["id"]+");'>"+
						"<div class='calendar_row'>"+
							"<div class='calendar_element_seats'>"+seats_string+"</div>"+
								
									"<div class='calendar_element_name_"+data['lessons'][i]["type"]+"'>"+data['lessons'][i]["name"]+"</div>"+
								
								"<div class='calendar_element_time'>"+data['lessons'][i]["time"]+"</div>"+
						"</div>"+
					"</a>"
					);
				}
				$("#bottom_container_calendar").append("</table>");
				
				//set date label
				$(".calendar_day_intestation").html(data['date']['current_label']);
				
				//save current date
				current_day = data['date']['current'];
				//save left date
				left_date = data['date']['prev'];
				//save right date
				right_date = data['date']['post'];
				
				$.mobile.loading( 'hide' );
				
				//document.addEventListener("backbutton", closeClicked, false);
				/*
				if(loading_visible>0){
					if(loading_visible==1){
						$.mobile.changePage( "#calendar", {
							changeHash: false,
							transition: "slide",
							reverse:true
						});
					}else{
						$.mobile.changePage( "#calendar", {
							changeHash: false,
							transition: "slide"
						});
					}
					
					loading_visible=0;
				}
				*/
				
				/*
				$('a.lesson_link').click(function(event) {
				
					event.preventDefault();
					
					var id_string = $(this).attr('href');
					var id = parseInt(id_string);
					
					if(id>=0){
					
						//alert("Id: "+id);
					
						current_lesson_id = id;
						//load lesson page
						$.mobile.changePage( "#lesson", {
							changeHash: true,
							transition: "pop" 
						});
					}
					
					//alert("Id: "+id);
					
					return false;
				});
				*/
				
			},
			error: function(xhr, status, error) {
				$.mobile.loading( 'hide' );
				alert("Impossibile contattare il server: riprova più tardi...");
			}
		});
 }
 
 function closeClicked(){
	navigator.app.exitApp();
 }
 
 function backClicked(){
	history.back();
	/*
	$.mobile.changePage( "#calendar", {
		changeHash: true,
		transition: "pop" 
	});
	*/
 }
 
 
 
 function lessonClicked(lesson_load_id){
 
	var id_string = lesson_load_id;
	var id = parseInt(id_string);
					
	if(id>=0){
		current_lesson_id = id;
		//load lesson page
		$.mobile.changePage( "#lesson", {
			changeHash: true,
			transition: "pop" 
		});
	}
 
	return false;
 }
 
 function moveDayLeft(){
 
	//alert("Date: "+left_date);
	if(left_date!=""){
	
		/*
		$('#bottom_container_calendar').animate({
			left: '100%',
		  }, 1000, function() {
			// Animation complete.
			//alert("Animation completed");
			
			$('#bottom_container_calendar').css("left","-100%");
			loadCalendar(user_id,left_date);
		  });
		*/
		/*
		loading_visible = 1;
		$.mobile.changePage( "#loading", {
			changeHash: false,
			transition: "slide",
			reverse:true
		});
		*/
		loadCalendar(user_id,left_date);
		
	}
	return false;
 }
 
  function moveDayRight(){
  
    //alert("Date: "+right_date);
	if(right_date!=""){
		/*
		loading_visible = 2;
		$.mobile.changePage( "#loading", {
			changeHash: false,
			transition: "slide" 
		});
		*/
		loadCalendar(user_id,right_date);
	}
	return false;
 }
 
 $(document).on('pagebeforeshow', '#calendar', function(){
 
	loadCalendar(user_id,current_day);
	
	//setting right swipe behaviour
	$( "div#bottom_container_calendar" ).on( "swiperight", swipeLeftCalendarHandler );
	function swipeLeftCalendarHandler( event ){
		//alert("swipe right detected");
		moveDayLeft();
	}
	
	//setting left swipe behaviour
	$( "div#bottom_container_calendar" ).on( "swipeleft", swipeRightCalendarHandler );
 	function swipeRightCalendarHandler( event ){
		//alert("swipe left detected");
		moveDayRight();
	}
	
 });
 
// ****** lesson logics ******
 function loadLesson( user, day, lesson, reserve, delete_id){
 
	var input_data = "user_id="+user;
	input_data+="&lesson_id="+lesson;
	input_data+="&date="+day;
	
	if(reserve>=0){
		input_data+="&reservation_type="+reserve;
	}
	if(delete_id>=0){
		input_data+="&delete_id="+delete_id;
	}

	$.mobile.loading( 'show', { theme: 'a', text: 'caricamento in corso...', textVisible: true } );
	//alert(input_data);

	$.ajax({
			type: "POST",
			url: "http://www.lotofit.it/lotoapp_mobile/getLesson.php",
			dataType: "json",
			data: input_data,
			success    : function(data) {
				
				$("#lesson_details_name_value").html(data['name']);
				$("#lesson_details_date_value").html(data['date_label']);
				$("#lesson_details_time_value").html(data['time']);
				$("#lesson_details_seats_value").html(data['seats']);
				
				$("#lesson_details_count_value").html(data['count']);
				$("#lesson_details_countconfirmed_value").html(data['count_confirmed']);
				$("#lesson_details_countnotconfirmed_value").html(data['count_notconfirmed']);
				$("#lesson_details_countlastminute_value").html(data['count_lastminute']);
				
				var status_html = "";
				if(data['type']=="0"){
					status_html="<div class='status_confirmed'>Prenotazione confermata</div>";
				}else if(data['type']=="1"){
					status_html="<div class='status_notconfirmed'>Prenotazione non confermata</div>";
				}else if(data['type']=="2"){
					status_html="<div class='status_lastminute'>Prenotazione last minute confermata</div>";
				}else{
					status_html="<div class='status_none'>Nessuna prenotazione</div>";
				}
				$("#lesson_details_status").html(status_html);
				
				var buttons_html = "";
				
				var confirm_string = data['confirm_enable'];
				var confirm_en = parseInt(confirm_string);
				var delete_string = data['delete_enable'];
				var delete_en = parseInt(delete_string);
				var reservation_string = data['reservation_enable'];
				var reservation_en = parseInt(reservation_string);
				
				if(confirm_en >= 0){
					buttons_html += "<input type='button' class='lesson_button' id='lesson_button_confirm' value='Conferma' onclick='reserveClicked(" + confirm_en + ")'/>";
				}
				
				if(delete_en >= 0){
					buttons_html += "<input type='button' class='lesson_button' id='lesson_button_delete' value='Cancella' onclick='deleteClicked(" + delete_en + ")'/>";
				}
				
				if(reservation_en >= 0){
					buttons_html += "<input type='button' class='lesson_button' id='lesson_button_reserve' value='Prenota' onclick='reserveClicked(" + reservation_en + ")'/>";
				}
				
				if(data['warning_message']!=""){
					buttons_html += "<div class='lesson_error_warning'>" + data['warning_message'] + "</div>";
				}
				
				$("#lesson_details_buttons").html(buttons_html);
				
				$.mobile.loading( 'hide' );
				
				//document.addEventListener("backbutton", backClicked, false);
				
			},
			error: function(xhr, status, error) {
				$.mobile.loading( 'hide' );
				alert("Impossibile contattare il server: riprova più tardi...");
			}
		});
 }
 
 function reserveClicked( reservation_type ){
 
	loadLesson(user_id,current_day,current_lesson_id,reservation_type,-1);
	
 }
 
  function deleteClicked( reservation_id ){
  
	loadLesson(user_id,current_day,current_lesson_id,-1,reservation_id);
	
 }
 
 $(document).on('pagebeforeshow', '#lesson', function(){
 
	loadLesson(user_id,current_day,current_lesson_id,-1,-1);
	
});
 
 