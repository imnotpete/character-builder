function CharacterViewModel(data) {
	var self = this;
	self.id = ko.observable(data.id);

	var json = data.json;
	if (json) {
		json = JSON.parse(data.json);
	} else {
		json = {};
	}

	setupLevelsTab(self, json);
	setupMainTab(self, json);
	setupAbilitiesTab(self, json);
	// Spells tab
	// Possessions tab
	setupNotesTab(self, json);

	self.updateData = function(data) {
		setupViewModel(self, data);
	}

	self.save = function() {
		$.ajax("/characters", {
			data : {
				id : self.id,
				name : self.name,
				json : ko.toJSON(self)
			},
			type : "post",
			success : function(result) {
				var id = getUrlParameter("id");
				if (id) {
					console.log("success");
				} else {
					console.log("redirecting");
					window.location.href = "character.html?id=" + result;
				}
			}
		});
	};
}

function setupViewModel(data) {
	if (!data) {
		data = {};
	}

	ko.applyBindings(new CharacterViewModel(data));
}

function getUrlParameter(param) {
	var pageURL = decodeURIComponent(window.location.search.substring(1)), urlVariables = pageURL
			.split('&'), parameterName, i;

	for (i = 0; i < urlVariables.length; i++) {
		parameterName = urlVariables[i].split('=');

		if (parameterName[0] === param) {
			return parameterName[1] === undefined ? true : parameterName[1];
		}
	}
};

$(document).ready(function() {
	var id = getUrlParameter("id");

	if (id) {
		$.getJSON("characters/1", setupViewModel);
	} else {
		setupViewModel({});
	}
});