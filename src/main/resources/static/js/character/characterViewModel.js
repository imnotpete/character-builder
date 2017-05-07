function CharacterViewModel(data) {
	var self = this;

	console.log("in setup: " + this);
	console.log("data: " + data.json)
	
	self.id = ko.observable(data.id);
	
	var json = data.json;	
	if (json) {
		json = JSON.parse(data.json);
	} else {
		json = {};
	}
	
	setupMainTab(self, json);
	setupLevelsTab(self, json);
	setupAbilitiesTab(self, json);
	// Spells tab
	// Possessions tab
	setupNotesTab(self, json);
	
	self.updateData = function(data) {
		setupViewModel(self, data);
	}
	
	self.save = function() {
        $.ajax("/characters", {
            data: {id: self.id, name: self.name, json : ko.toJSON(self) },
            type: "post",
            success: function(result) { alert(result) }
        });
    };
}

function setupViewModel(data) {
	if (!data) {
		data = {};
	} 

	ko.applyBindings(new CharacterViewModel(data));
}

$(document).ready(function() {
	$.getJSON("characters/1", setupViewModel);
});