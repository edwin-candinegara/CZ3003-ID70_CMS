Meteor.startup(function () {
	GoogleMaps.load();
});

var contentString;
var infowindow;
var marker; 

Template.map.onRendered(function () {

});

Template.map.onCreated(function () {
	GoogleMaps.ready('map', function (map) {
		google.maps.event.addListener(map.instance, 'click', function(event) {
			placeMarker(event.latLng);
		});

	});



	function placeMarker(location) {
		if ( marker ) {
			marker.setPosition(location);
			infowindow.close();

		} else {
			marker = new google.maps.Marker({
				draggable: true,
				animation: google.maps.Animation.DROP,
				position: location,
				map: GoogleMaps.maps.map.instance,
				title: "Submit a new case"
			});

			contentString =  
				'<h5 id="firstHeading" class="text-center">Create New Case</h5>'+

				'<div class="container-fluid">'+
					'<form class="form-horizontal center-block" id ="create-case-form">' +
					
						'<div class="form-group">'+
							'<div class="col-sm-12">'+
								'<input type="text" class="form-control" name="title" placeholder="Title" id ="create-case-title">'+
							'</div>'+
						'</div>'+


						'Case Type:' +

						'<div class="form-group">'+
							'<div class="col-sm-12">'+
				    			'<select class="form-control formwidth" name="type" width="200" id ="create-case-type">' +
								 	'<option value="Fire">Fire</option>'+
								  	'<option value="Traffic Accidents">Traffic Accidents</option>'+
								'</select>'+
							'</div>'+
						'</div>'+
						
						'Address:' +

						'<div class="form-group">'+
							'<div class="col-sm-12">'+
								'<input type="text" class="form-control" name="address" placeholder="Address" id ="create-case-address"/>'+
							'</div>'+
						'</div>'+
						
						'Description:' +

						'<div class="form-group">'+
							'<div class="col-sm-12">'+
								'<textarea class="form-control formwidth" name="description" id ="create-case-description"></textarea>' +
							'</div>'+
						'</div>'+
						
						'<div class="form-group">'+
							'<div class="col-sm-6">'+
								'<button type="reset"  class="btn btn-primary">Reset</button>'+ 
							'</div>'+
							'<div class="col-sm-6">'+ 
								'<button type="submit" class="btn btn-primary create-case-submit">Submit</button>' +
							'</div>'+
						'</div>'+
						
					'</form>'+
				'</div>' ;

			infowindow = new google.maps.InfoWindow({ 
				content: contentString
			});

			marker.addListener('click', function() {
				infowindow.open(GoogleMaps.maps.map.instance, marker);

				// THIS VALIDATOR MUST BE INSIDE THIS LISTENER
				// If not, the validator is not instantiated correctly because the form has not been rendered yet
				var createCaseValidator = $('#create-case-form').validate({
					submitHandler: function (form, event) {
						event.preventDefault();
						
						var title 		= $('#create-case-title').val();
						var type 		= $('#create-case-type').val();
						var address 	= $('#create-case-address').val();
						var description = $('#create-case-description').val();

						/*
						Meteor.createCaseWithPassword(email, password, function (error) {
							if (error) {
								if (error.reason == "User not found") {
									createCaseValidator.showErrors({
										email: error.reason
									});
								}

								if (error.reason == "Incorrect password") {
									createCaseValidator.showErrors({
										password: error.reason
									});
								}

								if (error.reason != "User not found" & error.reason != "Incorrect password") {
									swal('createCase', error.reason, 'error');
								}
							}
						});*/
					},
					rules: {
						title: {
							minlength: 3,
							maxlength: 20,
							required: true
						},
						type: {
							required: true
						},
						address: {
							minlength: 3,
							maxlength: 40,
							required: true
						},
						description: {
							minlength: 3,
							maxlength: 200,
							required: true
						}
					},

					messages: {
						title: {
							minlength: "The case title must be between 3 to 20 characters!",
							maxlength: "The case title must be between 3 to 20 characters!",
							required: "You must enter a case title!"
						},
						type: {
							required: "You must select a case type!"
						}, 
						address: {
							minlength: "The address must be between 3 to 40 characters!",
							maxlength: "The address must be between 3 to 40 characters!",
							required: "You must enter an address!"
						}, 
						description: {
							minlength: "The description must be between 3 to 200 characters!",
							maxlength: "The description must be between 3 to 200 characters!",
							required: "You must enter a description!"
						}
					},
					highlight: function (element) {
						$(element).closest('.form-group').addClass('has-error');
						$(element).closest('.form-group').removeClass('has-success');
					},
					unhighlight: function (element) {
						$(element).closest('.form-group').addClass('has-success');
						$(element).closest('.form-group').removeClass('has-error');
					},
					errorElement: 'span',
					errorClass: 'help-block',
					errorPlacement: function (error, element) {
						if (element.parent('.input-group').length) {
							error.insertAfter(element.parent());
						} else {
							error.insertAfter(element);
						}
					}
				});
			});
		}
	}
});

Template.map.helpers({
	mapOptions: function () {
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(1.346286, 103.680793),
				streetViewControl: false,
				zoom: 17
			};
		}
	}
});



Template.map.events({
	'click .create-case-submit': function () {
		console.log('click');
		// from Kenrick, just to add some data to db, plz modify accordingly. Thank you :)
 		var title = $('#create-case-title').val();
 		var category = $('#create-case-category').val();
 		var description = $('#create-case-description').val();
 		var address = $('#create-case-address').val();
 		var coordinate = marker.position;
 		var severity = $('#create-case-severity').val();
		Meteor.call('addCase', title, category, description, address, coordinate, severity, function (error, result) {
 			if (error) {
 				swal('Oops!', error.reason, 'error');
 			} else {
 				swal({
 					title: 'Thank you!',
 					text: 'The new case has been reported!',
 					type: 'success'
 				});
 			}
 		});
	}
});


/*

	TODO

	Benerin form --> ikutin Bootstrap classes (see resetPasswordForm for example) V
	Form checking --> use jQuery validator (see other JS files loginForm.js)
	create insert method @ methods.js
	Marker --> different color and undragable for existing cases
	Load existing cases marker initially
	Observe realtime cases (see below)
	Kalau ada user lgsg approve, else pending + severity NULL

*/
/*	reference

var markers = {};   

Markers.find().observe({  
  added: function(document) {
    // Create a marker for this document
    var marker = new google.maps.Marker({
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(document.lat, document.lng),
      map: map.instance,
      // We store the document _id on the marker in order 
      // to update the document within the 'dragend' event below.
      id: document._id
    });

    // This listener lets us drag markers on the map and update their corresponding document.
    google.maps.event.addListener(marker, 'dragend', function(event) {
      Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
    });

    // Store this marker instance within the markers object.
    markers[document._id] = marker;
  },
  changed: function(newDocument, oldDocument) {
    markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
  },
  removed: function(oldDocument) {
    // Remove the marker from the map
    markers[oldDocument._id].setMap(null);

    // Clear the event listener
    google.maps.event.clearInstanceListeners(
      markers[oldDocument._id]);

    // Remove the reference to this marker instance
    delete markers[oldDocument._id];
  }
});	
	var marker;

	function placeMarker(location) {
		if ( marker ) {
			marker.setPosition(location);
		} else {
			marker = new google.maps.Marker({
				position: location,
				map: GoogleMaps.maps.map.instance
			});
		}
	}

	google.maps.event.addListener(GoogleMaps.maps.map.instance, 'click', function(event) {
		placeMarker(event.latLng);
	});*/
