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
	setupSpellsTab(self, json);
	// Inventory tab
	setupNotesTab(self, json);

	self.updateData = function(data) {
		setupViewModel(self, data);
	}

	self.save = function() {
		var name = $('#characterName').val();
		if (!name || name === '') {
			$('#characterName').parent().addClass('has-error');
			$.toaster({priority : 'danger', title : 'Error', message : 'Your character needs a name!'});
			return;
		} else {
			$('#characterName').parent().removeClass('has-error');
		}
		
		$.ajax("characters", {
			data : {
				id : self.id,
				name : self.name,
				json : ko.toJSON(self)
			},
			type : "post",
			success : function(result) {
				var id = getUrlParameter("id");
				if (id) {
					$.toaster({
						priority : 'success',
						title : 'Success',
						message : 'Character saved'
					});
				} else {
					$.toaster({
						priority : 'success',
						title : 'Success',
						message : 'Redirecting...'
					});
					
					setTimeout(function() {
						window.location.href = "character.html?id=" + result;
					}, 1500);
				}
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
	};

	self.deleteCharacter = function() {
		$.ajax("characters/" + self.id(), {
			type : "DELETE",
			success : function(result) {
				$.toaster({
					priority : 'success',
					title : 'Success',
					message : 'Redirecting...'
				});

				setTimeout(function() {
					window.location.href = "index.html";
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
	// make error toast messages stay onscreen longer
	$.toaster({settings : {timeout : {danger : 10000}}});
	
	var id = getUrlParameter("id");

	if (id) {
		$.getJSON("characters/" + id, setupViewModel);
	} else {
		setupViewModel({});
	}
});