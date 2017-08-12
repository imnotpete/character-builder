function setupNotesTab(self, data) {
	if (!data) {
		data = {}
	}
	
	self.editingNotes = ko.observable(false);
	self.notes = ko.observable(data.notes);
	
	self.notesRendered = ko.computed(function() {
		return mmd(self.notes());
	});
	
	self.toggleEditingNotes = function() {
		self.editingNotes(! self.editingNotes());
	}
}