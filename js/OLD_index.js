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
 
 function authenticateCall(){
 
			var form_values=$("#login_form").serialize();
		
			$.ajax({
				type: "POST",
				url: "http://www.lotofit.it/lotoapp_mobile/authenticate.php",
				dataType: "json",
				data: form_values,
				success    : function(data) {
					//console.error(JSON.stringify(response));
					//alert('Works!');
					//$("#content_container2").html("<p>Response arrived</p>");
					
					if(data["user"]=="-1"){
						$("#login_form_warning").html("Attenzione: username o password sono errati. Riprova.");
					}else{
						//alert("Success "+data["user"]);
						
						$.mobile.changePage( "./calendar.html", {
							type: "get",
							data: "user_id="+data["user"],
							changeHash: true,
							transition: "pop" 
						});
						//window.location = "calendar.html?user_id="+data["user"];
					}
				}
			});
			
			return false;
 }
 /*
 $(document).on('pagebeforeshow', '#headline', function(){
 
 });
 */
 
 /*
var app = {
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
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
	
		$('#login_form').submit(function() {
			var form_values=$("#login_form").serialize();
		
			$.ajax({
				type: "POST",
				url: "http://www.lotofit.it/lotoapp_mobile/authenticate.php",
				dataType: "json",
				data: form_values,
				success    : function(data) {
					//console.error(JSON.stringify(response));
					//alert('Works!');
					//$("#content_container2").html("<p>Response arrived</p>");
					
					if(data["user"]=="-1"){
						$("#login_form_warning").html("Attenzione: username o password sono errati. Riprova.");
					}else{
						//alert("Success "+data["user"]);
						window.location = "calendar.html?user_id="+data["user"];
					}
				}
			});
			
			return false;
		
		});
    }
};
*/
