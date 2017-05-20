function setupLevelsTab(self, data) {
	if (!data) {
		data = {}
	}

	self.availableBaseAttackBonuses = [ "Good", "Average", "Poor" ];
	self.availableBaseSaves = [ "Good", "Poor" ];
	self.availableSkills = [ "Appraise", "Balance", "Bluff", "Climb",
			"Concentration", "Craft", "Decipher Script", "Diplomacy",
			"Disable Device", "Disguise", "Escape Artist", "Forgery",
			"Gather Information", "Handle Animal", "Heal", "Hide",
			"Intimidate", "Jump", "Knowledge", "Listen", "Move Silently",
			"Open Lock", "Perform", "Profession", "Ride", "Search",
			"Sense Motive", "Slight Of Hand", "Speak Language", "Spellcraft",
			"Spot", "Survival", "Swim", "Tumble", "Use Magic Device",
			"Use Rope" ];

	self.classes = ko.observableArray([]);

	for (i in data.classes) {
		self.classes().push(new Class(data.classes[i], self.availableSkills));
	}

	self.levels = ko.observableArray([]);

	for (i in data.levels) {
		self.levels().push(new Level(data.levels[i]))
	}

	self.classLevel = ko.computed(function() {
		return self.levels().length;
	})

	self.totalHdRolls = ko.computed(function() {
		var total = 0;

		for (i in self.levels()) {
			var hdRoll = parseInt(self.levels()[i].hdRoll()) || 0;
			total += hdRoll;
		}

		return total;
	});

	self.classMap = ko.computed(function() {
		var map = {};

		for (i in self.classes()) {
			var thisClass = self.classes()[i];
			map[thisClass.className()] = thisClass;
		}

		return map;
	});

	self.addLevel = function() {
		var level = new Level({});
		self.levels.push(level);
	};

	self.removeLevel = function(level) {
		self.levels.remove(level)
	};

	self.addClass = function() {
		var charClass = new Class({}, self.availableSkills);
		self.classes.push(charClass);
	};

	self.removeClass = function(charClass) {
		self.classes.remove(charClass)
	};
}

function Class(data, defaultSkills) {
	if (!data) {
		data = {}
	}

	var self = this;
	self.className = ko.observable(data.className);
	self.confirmingDeletion = ko.observable(false);

	self.baseAttackBonus = ko.observable(data.baseAttackBonus);
	self.baseFortSave = ko.observable(data.baseFortSave);
	self.baseRefSave = ko.observable(data.baseRefSave);
	self.baseWillSave = ko.observable(data.baseWillSave);
	self.skills = ko.observableArray([]);

	for (i in data.skills) {
		self.skills().push(new Skill(data.skills[i]));
	}

	if (self.skills().length < 1) {
		for (i in defaultSkills) {
			self.skills().push(new Skill({
				name : defaultSkills[i],
				classSkill : false
			}));
		}
	}

	self.tryDeletion = function() {
		self.confirmingDeletion(true);
	};

	self.cancelDeletion = function() {
		self.confirmingDeletion(false);
	};
}

function Level(data) {
	var self = this;
	self.className = ko.observable(data.className);
	self.hdRoll = ko.observable(data.hdRoll);
//	self.skills = ko.observableArray(data.skills);

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

function Skill(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.classSkill = ko.observable(data.classSkill);
}