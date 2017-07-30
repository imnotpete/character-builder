var defaultSkills = [ {
	name : "Appraise",
	ability : "Intelligence",
	acp : false,
	trainedOnly : false
}, {
	name : "Balance",
	ability : "Dexterity",
	acp : true,
	trainedOnly : false
}, {
	name : "Bluff",
	ability : "Charisma",
	acp : false,
	trainedOnly : false
}, {
	name : "Climb",
	ability : "Strength",
	acp : true,
	trainedOnly : false
}, {
	name : "Concentration",
	ability : "Constitution",
	acp : false,
	trainedOnly : false
}, {
	name : "Craft",
	ability : "Intelligence",
	acp : false,
	trainedOnly : false
}, {
	name : "Decipher Script",
	ability : "Intelligence",
	acp : false,
	trainedOnly : true
}, {
	name : "Diplomacy",
	ability : "Charisma",
	acp : false,
	trainedOnly : false
}, {
	name : "Disable Device",
	ability : "Intelligence",
	acp : false,
	trainedOnly : true
}, {
	name : "Disguise",
	ability : "Charisma",
	acp : false,
	trainedOnly : false
}, {
	name : "Escape Artist",
	ability : "Dexterity",
	acp : true,
	trainedOnly : false
}, {
	name : "Forgery",
	ability : "Intelligence",
	acp : false,
	trainedOnly : false
}, {
	name : "Gather Information",
	ability : "Charisma",
	acp : false,
	trainedOnly : false
}, {
	name : "Handle Animal",
	ability : "Charisma",
	acp : false,
	trainedOnly : true
}, {
	name : "Heal",
	ability : "Wisdom",
	acp : false,
	trainedOnly : false
}, {
	name : "Hide",
	ability : "Dexterity",
	acp : true,
	trainedOnly : false
}, {
	name : "Intimidate",
	ability : "Charisma",
	acp : false,
	trainedOnly : false
}, {
	name : "Jump",
	ability : "Strength",
	acp : true,
	trainedOnly : false
}, {
	name : "Knowledge",
	ability : "Intelligence",
	acp : false,
	trainedOnly : true
}, {
	name : "Listen",
	ability : "Wisdom",
	acp : false,
	trainedOnly : false
}, {
	name : "Martial Lore",
	ability : "Intelligence",
	acp : false,
	trainedOnly : true
}, {
	name : "Move Silently",
	ability : "Dexterity",
	acp : true,
	trainedOnly : false
}, {
	name : "Open Lock",
	ability : "Dexterity",
	acp : false,
	trainedOnly : true
}, {
	name : "Perform",
	ability : "Charisma",
	acp : false,
	trainedOnly : false
}, {
	name : "Profession",
	ability : "Wisdom",
	acp : false,
	trainedOnly : true
}, {
	name : "Ride",
	ability : "Dexterity",
	acp : false,
	trainedOnly : false
}, {
	name : "Search",
	ability : "Intelligence",
	acp : false,
	trainedOnly : false
}, {
	name : "Sense Motive",
	ability : "Wisdom",
	acp : false,
	trainedOnly : false
}, {
	name : "Sleight Of Hand",
	ability : "Dexterity",
	acp : true,
	trainedOnly : true
}, {
	name : "Speak Language",
	ability : "None",
	acp : false,
	trainedOnly : true
}, {
	name : "Spellcraft",
	ability : "Intelligence",
	acp : false,
	trainedOnly : true
}, {
	name : "Spot",
	ability : "Wisdom",
	acp : false,
	trainedOnly : false
}, {
	name : "Survival",
	ability : "Wisdom",
	acp : false,
	trainedOnly : false
}, {
	name : "Swim",
	ability : "Strength",
	acp : true,
	trainedOnly : false
}, {
	name : "Tumble",
	ability : "Dexterity",
	acp : true,
	trainedOnly : true
}, {
	name : "Use Magic Device",
	ability : "Charisma",
	acp : false,
	trainedOnly : true
}, {
	name : "Use Rope",
	ability : "Dexterity",
	acp : false,
	trainedOnly : false
} ];

function setupLevelsTab(self, data) {
	if (!data) {
		data = {}
	}

	self.availableBaseAttackBonuses = [ "Good", "Average", "Poor" ];
	self.availableBaseSaves = [ "Good", "Poor" ];
	self.availableSkills = ko.observableArray([]);
	
	for (i in data.availableSkills) {
		self.availableSkills().push(data.availableSkills[i]);
	}
	
	if (self.availableSkills().length < 1) {
		for (i in defaultSkills) {
			self.availableSkills().push(defaultSkills[i]);
		}
	}

	self.classes = ko.observableArray([]);
	self.levels = ko.observableArray([]);

	self.isClassSkill = function(className, skillName) {
		for (i in self.classes()) {
			var thisClass = self.classes()[i];
			if (thisClass.className() === className) {
				return thisClass.isClassSkill(skillName);
			}
		}
	};

	self.totalSkillRanks = function(skillName) {
		var totalRanks = 0;

		for (i in self.levels()) {
			totalRanks += self.levels()[i].totalLevelSkillRanks(skillName);
		}

		return totalRanks;
	};

	self.skillMod = function(skillName) {
		var totalRanks = Math.floor(self.totalSkillRanks(skillName));

		var linkedAbility = null;
		for (i in self.availableSkills()) {
			var skill = self.availableSkills()[i];

			if (skill.name === skillName) {
				linkedAbility = skill.ability;
				break;
			}
		}
		
		var abilityMod = 0;
		
		if (linkedAbility != "None") {
			abilityMod = self.abilityMod(linkedAbility);
		}

		return totalRanks + abilityMod;
	}

	for (i in data.classes) {
		self.classes().push(new Class(data.classes[i], self.availableSkills()));
	}

	for (i in data.levels) {
		self.levels().push(
				new Level(data.levels[i], self.availableSkills(), self))
	}

	self.classLevel = ko.computed(function() {
		return self.levels().length;
	});

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
		var level = new Level({}, self.availableSkills(), self);
		self.levels.push(level);
	};

	self.removeLevel = function(level) {
		console.log(level);
		self.levels.remove(level)
	};

	self.addClass = function() {
		var charClass = new Class({}, self.availableSkills());
		self.classes.push(charClass);
	};

	self.removeClass = function(charClass) {
		self.classes.remove(charClass)
	};
	
	self.resetSkills = function() {
		
	}
}

function Class(data, availableSkills) {
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
		self.skills().push(new ClassSkill(data.skills[i]));
	}

	if (self.skills().length < 1) {
		for (i in availableSkills()) {
			self.skills().push(new ClassSkill({
				name : availableSkills()[i].name,
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

	self.isClassSkill = function(skillName) {
		for (i in self.skills()) {
			var thisSkill = self.skills()[i];
			if (thisSkill.name() === skillName) {
				return thisSkill.classSkill();
			}
		}
	};
}

function Level(data, availableSkills, parent) {
	var self = this;
	self.className = ko.observable(data.className);
	self.hdRoll = ko.observable(data.hdRoll);
	self.skillPoints = ko.observableArray([]);

	self.isClassSkill = function(skillName) {
		return parent.isClassSkill(self.className(), skillName);
	};

	self.totalSkillRanks = function(skillName) {
		return parent.totalSkillRanks(skillName);
	};

	self.totalLevelSkillRanks = function(skillName) {
		for (i in self.skillPoints()) {
			var skillPoint = self.skillPoints()[i];
			if (skillPoint.name() === skillName) {
				// divide points by 2 if it's cross-class
				var points = skillPoint.points();
				return points / (skillPoint.isClassSkill() ? 1 : 2);
			}
		}
	};

	for (i in data.skillPoints) {
		self.skillPoints().push(new SkillPoint(data.skillPoints[i], self));
	}

	if (self.skillPoints().length < 1) {
		for (i in availableSkills) {
			self.skillPoints().push(new SkillPoint({
				name : availableSkills()[i].name,
				points : 0
			}, self));
		}
	}

	self.confirmingDeletion = ko.observable(false);
	self.editingSkills = ko.observable(false);

	self.tryDeletion = function() {
		self.confirmingDeletion(true);
	};

	self.cancelDeletion = function() {
		self.confirmingDeletion(false);
	};

	self.toggleEditingSkills = function() {
		self.editingSkills(!self.editingSkills());
	};
}

function ClassSkill(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.classSkill = ko.observable(data.classSkill);
}

function SkillPoint(data, parent) {
	var self = this;
	self.name = ko.observable(data.name);
	self.points = ko.observable(data.points);

	self.isClassSkill = ko.computed(function() {
		return parent.isClassSkill(self.name());
	});

	self.totalRanks = ko.computed(function() {
		return parent.totalSkillRanks(self.name());
	});
}