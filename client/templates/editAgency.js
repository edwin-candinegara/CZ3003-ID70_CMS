/**
*	Author: Peter
*/

Template.editAgency.onRendered(function () {
	var agencyId = this.data._id;
	var editAgencyValidator = $('#edit-agency-form').validate({
	 	submitHandler: function (form, event) {
	 		event.preventDefault();

	 		var name = $('#edit-agency-name').val();
	 		var category = $('#edit-agency-category').val();
	 		var contact = $('#edit-agency-contact').val();
	 		var address = $('#edit-agency-address').val();

	 		if (category === 'select') {
	 			editAgencyValidator.showErrors({
	 				category: 'Please select the correct agency category!'
	 			});

	 			return false;
	 		} else {
		 		Meteor.call('editAgency', agencyId, name, category, contact, address, function (error, result) {
		 			if (error) {
		 				swal('Edit Agency', error.reason, 'error');
		 			} else {
		 				swal({
		 					title: 'Edit Agency',
		 					text: 'The agency has successfully been edited!',
		 					type: 'success'
		 				}, function () {
		 					Router.go('agencies');
		 				});
		 			}
		 		});
		 	}
	 	},
	 	rules: {
	 		name: {
	 			minlength: 3,
	 			maxlength: 50,
	 			required: true
	 		},
	 		category: {
	 			categoryCheck: true
	 		},
	 		contact: {
	 			minlength: 8,
	 			maxlength: 8,
	 			digits: true,
	 			required: true
	 		},
	 		address: {
	 			minlength: 3,
	 			maxlength: 100,
	 			required: true
	 		}
	 	},
	 	messages: {
	 		name: {
	 			required: "You must enter the agency's name!",
	 			minlength: "The agency's name must be between 3 to 50 characters!",
	 			maxlength: "The agency's name must be between 3 to 50 characters!"
	 		},
	 		contact: {
	 			required: "You must enter the agency's contact number!",
	 			minlength: "The agency's contact number must consist of 8 digits!",
	 			maxlength: "The agency's contact number must consist of 8 digits!",
	 			digits: "The agency's contact number must be consist of digits only!"
	 		},
	 		address: {
	 			required: "You must enter the agency's address!",
	 			minlength: "The agency's address must be between 3 to 100 characters!",
	 			maxlength: "The agency's address must be between 3 to 100 characters!"
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

// jQuery validator add-on methods
jQuery.validator.addMethod("categoryCheck", function(value, element) {
    return this.optional(element) || /[^{select}]/.test(value);
}, "Please select the correct agency category!");

Template.editAgency.helpers({
	isCategorySelected: function (k) {
		return k === this.category;
	},
	getCategoryList: function () {
		return Categories.find();
	}
});

Template.editAgency.events({
	'click #edit-agency-back-button': function () {
		Router.go('agencies');
	}
});