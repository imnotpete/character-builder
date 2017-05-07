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

$(document).ready(function() {
	$.getJSON("characters", setupViewModel);
});