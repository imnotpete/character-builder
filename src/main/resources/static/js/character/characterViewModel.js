var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var loggedInUser;

function CharacterViewModel(data) {
	var self = this;
	self.id = ko.observable(data.id);
	console.log("data owner: " + data.owner);
	self.owner = ko.observable(data.owner);
	console.log("self owner: " + self.owner());

	self.mine = ko.computed(function() {
		console.log("checking mine");
		if (null == self.id()) {
			console.log("it's null");
			return true;
		}
		console.log("mine? " + loggedInUser == self.owner())

		console.log("loggedInUser " + loggedInUser);
		console.log("owner " + self.owner());
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
}

function setupViewModel(data) {
	if (!data) {
		data = {};
	} else {
		document.title = data.name + " :: Character Builder";
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

function loggedInHandler(username) {
	console.log("Loggedin request finished " + username);
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
	
	console.log("Started");
	console.log("token: " + token);
	console.log("header: " + header);
	$.get("/api/users/loggedin", loggedInHandler);
	console.log("Loggedin request sent");
});
