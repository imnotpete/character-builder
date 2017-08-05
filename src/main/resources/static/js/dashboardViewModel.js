function Character(character) {
	console.log("character " + JSON.stringify(character));
	var self = this;
	self.name = ko.observable(character.name);
	self.id = ko.observable(character.id);
}

function DashboardViewModel(data) {
	var self = this;

	self.characters = ko.observableArray([]);
	console.log("data: " + JSON.stringify(data));

	for (i in data) {
		self.characters().push(new Character(data[i]));
	}

	console.log("characters: " + JSON.stringify(self.characters()));
}

function setupViewModel(data) {
	if (!data) {
		data = [];
	}

	ko.applyBindings(new DashboardViewModel(data));
}

function importCharacter() {
	var data = $("#characterJson").val();
	$.ajax("characters", {
		data : JSON.parse(data),
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

$(document).ready(function() {
	// make error toast messages stay onscreen longer
	$.toaster({
		settings : {
			timeout : {
				danger : 10000
			}
		}
	});

	$.getJSON("characters", setupViewModel);
});