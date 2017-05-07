function setupNotesTab(self, data) {
	if (!data) {
		data = {}
	}
	
	self.notes = ko.observable(data.notes);
}