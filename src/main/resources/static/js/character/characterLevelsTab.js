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

	self.selectedSkillBackup;
	self.selectedSkill = ko.observable();
	self.availableBaseAttackBonuses = [ "Good", "Average", "Poor" ];
	self.availableBaseSaves = [ "Good", "Poor" ];
	self.availableSkills = ko.observableArray([]);


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
	
	for (i in data.availableSkills) {
		self.availableSkills().push(new Skill(data.availableSkills[i], self));
	}

	if (self.availableSkills().length < 1) {
		for (i in defaultSkills) {
			self.availableSkills().push(new Skill(defaultSkills[i], self));
		}
	}

	self.skillMod = function(skillName) {
		var totalRanks = Math.floor(self.totalSkillRanks(skillName));

		var skill;
		for (i in self.availableSkills()) {
			var iterSkill = self.availableSkills()[i];
			if (iterSkill.name() === skillName) {
				skill = iterSkill;
				break;
			}
		}

		var abilityMod = 0;

		if (skill.ability() != "None") {
			abilityMod = self.abilityMod(skill.ability());
		}

		var acp = 0;
		
		if (skill.acp()) {
			acp = self.totalAcp();
		}

		var miscMod = parseInt(skill.misc()) || 0;
		
		return totalRanks + abilityMod + miscMod + acp;
	}

	for (i in data.classes) {
		self.classes().push(new Class(data.classes[i], self));
	}

	for (i in data.levels) {
		self.levels().push(new Level(data.levels[i], self))
	}

	self.totalSkillTricks = ko.computed(function() {
		var totalSkillTricks = 0;
		
		for (i in self.levels()) {
			var level = self.levels()[i];
			
			if (level.skillTrick()) {
				totalSkillTricks++;
			}
		}
		
		return totalSkillTricks;
	});
	
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
		var level = new Level({}, self);
		self.levels.push(level);
	};

	self.removeLevel = function(level) {
		self.levels.remove(level)
	};

	self.addClass = function() {
		var charClass = new Class({}, self);
		self.classes.push(charClass);
	};

	self.removeClass = function(charClass) {
		self.classes.remove(charClass)
	};

	self.addSkill = function() {
		var skill = new Skill({
			name : "New Skill",
			ability : "None",
			acp : false,
			trainedOnly : false
		}, self);
		
		self.availableSkills.push(skill);
		
		for (i in self.classes()) {
			var charClass = self.classes()[i];
			charClass.addSkill(skill);
		}
		
		for (i in self.levels()) {
			var level = self.levels()[i];
			level.addSkill(skill);
		}
	}
	
	self.setSelectedSkill = function(selectedSkill) {
		self.selectedSkill(selectedSkill);
		self.selectedSkillBackup = ko.toJSON(selectedSkill);
		self.selectedSkillBackup = selectedSkill;
	}
	
	self.saveEditSkill = function() {
		self.availableSkills.valueHasMutated();
	}
	
	self.cancelEditSkill = function() {
	}
	
	self.deleteSkill = function(skillToDelete) {
		var skill = self.selectedSkill();
		self.availableSkills.remove(self.selectedSkill());
		
		for (i in self.classes()) {
			var charClass = self.classes()[i];
			charClass.deleteSkill(skill);
		}
		
		for (i in self.levels()) {
			var level = self.levels()[i];
			level.deleteSkill(skill);
		}
	}

	self.resetSkills = function() {

	}
	
	self.classBreakdown = ko.computed(function() {
		var levelsPerClass = {};
		for (i in self.levels()) {
			var className = self.levels()[i].className();
			
			if (null == levelsPerClass[className]) {
				levelsPerClass[className] = 1;
			} else {
				levelsPerClass[className] = levelsPerClass[className] + 1;
			}
		}
		
		var breakdown = "";
		for (className in levelsPerClass) {
			var classTotal = "/" + className + " " + levelsPerClass[className];
			breakdown += classTotal;
		}
		
		if (breakdown.length > 0) {
			// Strip leading slash
			breakdown = breakdown.substring(1, breakdown.length);
		}
		
		return breakdown;
	});
}

function Class(data, parent) {
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
		var skill = data.skills[i];
		
		for (j in parent.availableSkills()) {
			var availableSkill = parent.availableSkills()[j];
			
			if (skill.name === availableSkill.name()) {
				skill.name = availableSkill.name;
				break;
			}
		}
		
		self.skills().push(new ClassSkill(skill));
	}

	if (self.skills().length < 1) {
		for (i in parent.availableSkills()) {
			self.skills().push(new ClassSkill({
				name : parent.availableSkills()[i].name,
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
	
	self.addSkill = function(skill) {
		self.skills.push(new ClassSkill(skill));
		self.skills.valueHasMutated();
	}

	self.deleteSkill = function(skill) {
		for (i in self.skills()) {
			var classSkill = self.skills()[i];
			if (classSkill.name() === skill.name()) {
				self.skills.remove(classSkill);
			}		
		}

		self.skills.valueHasMutated();
	}
}

function Level(data, parent) {
	var self = this;
	self.className = ko.observable(data.className);
	self.hdRoll = ko.observable(data.hdRoll);
	self.skillPoints = ko.observableArray([]);
	self.skillTrick = ko.observable(data.skillTrick);
	
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
		var skillPoint = data.skillPoints[i];
		
		for (j in parent.availableSkills()) {
			var availableSkill = parent.availableSkills()[j];
			
			if (skillPoint.name === availableSkill.name()) {
				skillPoint.name = availableSkill.name;
				break;
			}
		}
		
		self.skillPoints().push(new SkillPoint(skillPoint, self));
	}
	
	if (self.skillPoints().length < 1) {
		for (i in parent.availableSkills()) {
			self.skillPoints().push(new SkillPoint({
				name : parent.availableSkills()[i].name,
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
	
	self.levelSkillPointsSpent = ko.computed(function() {
		var totalPointsSpent = 0;
		
		for (i in self.skillPoints()) {
			totalPointsSpent += parseInt(self.skillPoints()[i].points()) || 0;
		}
		
		if (self.skillTrick()) {
			totalPointsSpent += 2;
		}
		
		return totalPointsSpent;
	})
	
	self.addSkill = function(skill) {
		self.skillPoints().push(new SkillPoint({
			name : skill.name,
			points : 0
		}, self));
		
		self.skillPoints.valueHasMutated();
	}

	self.deleteSkill = function(skill) {
		for (i in self.skillPoints()) {
			var levelSkill = self.skillPoints()[i];
			if (levelSkill.name() === skill.name()) {
				self.skillPoints.remove(levelSkill);
			}		
		}

		self.skillPoints.valueHasMutated();
	}
}

function ClassSkill(data) {
	var self = this;
	self.name = ko.computed(function() {return data.name()});
	self.classSkill = ko.observable(data.classSkill);
}

function SkillPoint(data, parent) {
	var self = this;
	self.name = ko.computed(function() {return data.name()});
	self.points = ko.observable(data.points);

	self.isClassSkill = ko.computed(function() {
		return parent.isClassSkill(self.name());
	});

	self.totalRanks = ko.computed(function() {
		return parent.totalSkillRanks(self.name());
	});
}

function Skill(data, parent) {
	var self = this;
	
	self.name = ko.observable(data.name);
	self.ability = ko.observable(data.ability);
	self.acp = ko.observable(data.acp);
	self.trainedOnly = ko.observable(data.trainedOnly);
	self.misc = ko.observable(data.misc);
	
	self.untrained = ko.computed(function() {
		console.log("parent " + JSON.stringify (parent));
		return self.trainedOnly() && parent.totalSkillRanks(self.name())<1
	});
}
