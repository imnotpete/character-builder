var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

function Character(character) {
	var self = this;
	self.name = ko.observable(character.name);
	self.id = ko.observable(character.id);
}

function DashboardViewModel(data) {
	var self = this;

	self.characters = ko.observableArray([]);

	for (i in data) {
		self.characters().push(new Character(data[i]));
	}
}

function setupViewModel(data) {
	if (!data) {
		data = [];
	}

	ko.applyBindings(new DashboardViewModel(data));
}

function importCharacter() {
	var data = $("#characterJson").val();
	data = JSON.parse(data);
	data.id = null;
	$.ajax("/api/characters", {
		data : data,
		type : "post",
		success : function(result) {
			$.toaster({
				priority : 'success',
				title : 'Success',
				message : 'Redirecting...'
			});

			setTimeout(function() {
				window.location.href = "character.html?id=" + result;
			}, 1500);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			$.toaster({
				priority : 'danger',
				title : 'Error ' + jqXHR.status,
				message : jqXHR.responseJSON.message
			});
		}
	});
}

function loggedInHandler(username) {
	
}

$(document).ready(function() {
	// make error toast messages stay onscreen longer
	$.toaster({
		settings : {
			timeout : {
				danger : 10000
			}
		}
	});

	$(document).ajaxSend(function(e, xhr, options) {
		xhr.setRequestHeader(header, token);
	});

	$.get("/api/users/loggedin", function(username) {
		$("#username").text(username);
		$.getJSON("/api/characters?owner=" + username, setupViewModel);
	});	
});