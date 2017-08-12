var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

// var isDirty = false;
var loggedInUser;

function CharacterViewModel(data) {
	console.log("CharacterViewModel")
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

	// var dirtyFlagInitialized;
	//	
	// // Always setup last
	// self.isDirty = ko.computed(function() {
	// console.log("in isDirty");
	// // Only actually runs toJS on initial setup; every call after that skips,
	// because we know it's dirty at that point.
	// if (!dirtyFlagInitialized) {
	// console.log("isDirty first run")
	// ko.toJS(self);
	// dirtyFlagInitialized = true;
	// return false;
	// }
	//		
	// console.log("isDirty true");
	// isDrity = true;
	// return true;
	// });

}

function changeTracker(objectToTrack, hashFunction) {    
	console.log("setup changeTracker");
    hashFunction = hashFunction || ko.toJSON;
    var lastCleanState = ko.observable(hashFunction(objectToTrack));
    
    var result = {
        somethingHasChanged : ko.dependentObservable(function() {
        	console.log("inside somethinghaschanged");
            return hashFunction(objectToTrack) != lastCleanState()
        }),
        markCurrentStateAsClean : function() {
        	console.log("inside markstateasclean");
            lastCleanState(hashFunction(objectToTrack));   
        }
    };
    
    return function() { return result }
}

function setupViewModel(data) {
	console.log("setupViewModel")
	if (!data) {
		data = {};
	} else {
		document.title = data.name + " :: Character Builder";
	}
	
	var viewModel = new CharacterViewModel(data);
	viewModel.tracker = new changeTracker(viewModel);

	ko.applyBindings(viewModel);
	
	console.log("dirty? in setup: " + viewModel.tracker().somethingHasChanged());
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
	console.log("loggedInHandler")
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

	window.onbeforeunload = function() {
		if (isDirty) {
			return 'Are you sure you want to leave?';
		}
	};

	$.get("/api/users/loggedin", loggedInHandler);
});
