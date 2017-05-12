function setupLevelsTab(self, data) {
	if (!data) {
		data = {}
	}

	self.levels = ko.observableArray([]);

	for (i in data.levels) {
		self.levels().push(new Level(data.levels[i]))
	}
	
	self.classLevel = ko.computed(function () {
		return self.levels().length;
	})
	
	self.totalHdRolls = ko.computed(function () {
		var total = 0;
		
		for (i in self.levels()) {
			var hdRoll = parseInt(self.levels()[i].hdRoll()) || 0;
			total += hdRoll;
		}
		
		return total;
	});

	self.addLevel = function() {
		var level = new Level({});
		self.levels.push(level);
	};

	self.removeLevel = function(level) {
		self.levels.remove(level)
	};
}

function Class(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.baseAttackBonus = ko.observable(data.baseAttackBonus);
	self.baseFortSave = ko.observable(data.baseFortSave);
	self.baseRefSave = ko.observable(data.baseRefSave);
	self.baseWillSave = ko.observable(data.baseWillSave);
}

function Level(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.hdRoll = ko.observable(data.hdRoll);
	// self.skills = ko.observableArray(data.skills);
	
	self.confirmingDeletion = ko
			.observable(data.confirmingDeletion ? data.confirmingDeletion
					: false);

	self.tryDeletion = function() {
		self.confirmingDeletion(true);
	};

	self.cancelDeletion = function() {
		self.confirmingDeletion(false);
	};
}

// function Skill(data) {
// var self = this;
// self.name = data.name;
// self.classSkill = data.classkill;
// }
