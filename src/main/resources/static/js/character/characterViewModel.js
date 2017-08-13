var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var loggedInUser;

function CharacterViewModel(data) {
	var self = this;
	self.id = ko.observable(data.id);
	self.owner = ko.observable(data.owner);

	self.mine = ko.computed(function() {
		if (null == self.id()) {
			return true;
		}

		return loggedInUser == self.owner();
	});

	var json = data.json;
	if (json) {
		json = JSON.parse(data.json);
	} else {
		json = {};
	}

	setupLevelsTab(self, json);
	setupMainTab(self, json);
	setupAbilitiesTab(self, json);
	// setupSpellsTab(self, json);
	// Inventory tab
	setupNotesTab(self, json);

	self.updateData = function(data) {
		setupViewModel(self, data);
	}

	self.save = function() {
		var name = $('#characterName').val();
		if (!name || name === '') {
			$('#characterName').parent().addClass('has-error');
			$.toaster({
				priority : 'danger',
				title : 'Error',
				message : 'Your character needs a name!'
			});
			return;
		} else {
			$('#characterName').parent().removeClass('has-error');
		}

		$.ajax("/api/characters", {
			data : {
				id : self.id,
				name : self.name,
				json : ko.toJSON(self)
			},
			type : "post",
			success : function(result) {
				self.tracker().markCurrentStateAsClean();
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
		$.ajax("/api/characters/" + self.id(), {
			type : "DELETE",
			success : function(result) {
				self.tracker().markCurrentStateAsClean();
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

	self.skillSort = function(left, right) {
		return left.name() == right.name() ? 0
				: (left.name() < right.name() ? -1 : 1)
	}
	
	self.tracker = new ChangeTracker(self);
}

function ChangeTracker(objectToTrack, hashFunction) {
	hashFunction = hashFunction || ko.toJSON;
	var lastCleanState = ko.observable(hashFunction(objectToTrack));

	var result = {
		somethingHasChanged : ko.dependentObservable(function() {
			return hashFunction(objectToTrack) != lastCleanState()
		}),
		markCurrentStateAsClean : function() {
			lastCleanState(hashFunction(objectToTrack));
		}
	};

	return function() {
		return result
	}
}

var viewModel;
function setupViewModel(data) {
	if (!data) {
		data = {};
	} else {
		document.title = data.name + " :: Character Builder";
	}

	viewModel = new CharacterViewModel(data);

	ko.applyBindings(viewModel);

	console
			.log("dirty? in setup: "
					+ viewModel.tracker().somethingHasChanged());
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

function loggedInHandler(username) {
	loggedInUser = username;
	$("#username").text(username);
	var id = getUrlParameter("id");

	if (id) {
		var characterJsonUrl = "/api/characters/" + id;

		$('#exportLink').prop('href', characterJsonUrl);
		$.getJSON(characterJsonUrl, setupViewModel);
	} else {
		$('exportLink').hide();
		setupViewModel({});
	}
}

$(window).bind('beforeunload', function() {
	if (viewModel.tracker().somethingHasChanged()) {
		return 'arbitrary string';
	}
});

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

	setupSessionTimeout();

	$.get("/api/users/loggedin", loggedInHandler);
});
