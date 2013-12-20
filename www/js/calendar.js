/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
  
var app2 = {

	// Read a page's GET URL variables and return them as an associative array.
	
	
	/*
	getUrlVars: function()
	{
		var vars = [], hash;
		var hashes = window.location.slice(window.location.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	*/

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app2.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
	
		//$("#content_container").append("<p>Calling server</p>");

		//alert("Started "+window.location);
		
		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location);
			if(results!=null){
				return results[1];
			}
			return "";
		}
		
		var user_id = $.urlParam("user_id");
		
		var input_data = "user_id="+user_id;
		
		var mydate = $.urlParam("date");
		//alert("Date: _"+mydate+"_");
		
		//alert("User: "+user_id);
		
		
		var date = $.urlParam("date");
		if(mydate!=""){
			input_data+="&date="+mydate;
		}
		
		//alert("Input: "+input_data);
		
		
		$.ajax({
			type: "POST",
			url: "http://www.lotofit.it/lotoapp_mobile/getDayCourses.php",
			dataType: "json",
			data: input_data,
			success    : function(data) {
				//console.error(JSON.stringify(response));
				//alert('Works!');
				//$("#content_container2").html("<p>Response arrived</p>");
				//$("#bottom_container").append("<table id='courses_table'>");
				for(var i in data['lessons']){
				
					var seats_string = "";
					if(data['lessons'][i]["count"]!=""){
						seats_string = data['lessons'][i]["count"]+"/"+data['lessons'][i]["seats"];
					}
									
					$("#bottom_container").append(
						"<div class='calendar_row'>"+
							"<div class='calendar_element_seats'>"+seats_string+"</div>"+
							//"<div class='calendar_row_left'>"+
								"<a class='lesson_link' href='lesson.html'>"+
									"<div class='calendar_element_name_"+data['lessons'][i]["type"]+"'>"+data['lessons'][i]["name"]+"</div>"+
								"</a>"+
								"<div class='calendar_element_time'>"+data['lessons'][i]["time"]+"</div>"+
							//"</div>"+
						"</div>"
					);
					
				}
				$("#bottom_container").append("</table>");
				
				$(".calendar_day_intestation").html(data['date']['current']);
				
				//alert("Msg: "+data['date']['msg']);
				//alert("Yesterday: "+data['date']['prev']);
				
				$("#day_link_post").attr("href","calendar.html?user_id="+user_id+"&date="+data['date']['post']);
				$("#day_link_prev").attr("href","calendar.html?user_id="+user_id+"&date="+data['date']['prev']);
				
			}
		});
		
    }
};
