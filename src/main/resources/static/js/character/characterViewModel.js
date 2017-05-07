function CharacterViewModel() {
	var self = this;

	setupMainTab(self);
	setupLevelsTab(self);
	setupAbilitiesTab(self);
	// Spells tab
	// Possessions tab
	setupNotesTab(self);
}

$(document).ready(function() {
	ko.applyBindings(new CharacterViewModel());
});