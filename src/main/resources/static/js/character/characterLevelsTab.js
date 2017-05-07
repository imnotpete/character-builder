function setupLevelsTab(self) {
	self.levels = ko.observableArray([]);

	self.addLevel = function() {
		var level = new Level({});
		self.levels.push(level);
	};

	self.removeLevel = function(level) {
		self.levels.remove(level)
	};
}

function Level(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.hdRoll = ko.observable(data.hdRoll);
	// self.skills = ko.observableArray(data.skills);
	self.confirmingDeletion = ko.observable(false);

	self.tryDeletion = function() {
		self.confirmingDeletion(true);
	};

	self.cancelDeletion = function() {
		self.confirmingDeletion(false);
	};
}

//function Skill(data) {
//	var self = this;
//	self.name = data.name;
//	self.classSkill = data.classkill;
//}