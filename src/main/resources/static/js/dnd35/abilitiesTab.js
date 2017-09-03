function setupAbilitiesTab(self, data) {
	if (!data) {
		data = {}
	}
	
	self.classFeatures1= ko.observable(data.classFeatures1);
	self.classFeatures2 = ko.observable(data.classFeatures2);
	self.raceFeatures1 = ko.observable(data.raceFeatures1);
	self.raceFeatures2 = ko.observable(data.raceFeatures2);
	self.feats1 = ko.observable(data.feats1);
	self.feats2 = ko.observable(data.feats2);
}