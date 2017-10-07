var sizeMap = {
	Fine : {
		name : "Fine",
		sizeMod : 8,
		grappleMod : -16,
		hideMod : 16
	},
	Diminutive : {
		name : "Diminutive",
		sizeMod : 4,
		grappleMod : -12,
		hideMod : 12
	},
	Tiny : {
		name : "Tiny",
		sizeMod : 2,
		grappleMod : -8,
		hideMod : 8
	},
	Small : {
		name : "Small",
		sizeMod : 1,
		grappleMod : -4,
		hideMod : 4
	},
	Medium : {
		name : "Medium",
		sizeMod : 0,
		grappleMod : 0,
		hideMod : 0
	},
	Large : {
		name : "Large",
		sizeMod : -1,
		grappleMod : 4,
		hideMod : -4
	},
	Huge : {
		name : "Huge",
		sizeMod : -2,
		grappleMod : 8,
		hideMod : -8
	},
	Gargantuan : {
		name : "Gargantuan",
		sizeMod : -4,
		grappleMod : 12,
		hideMod : -12
	},
	Colossal : {
		name : "Colossal",
		sizeMod : -8,
		grappleMod : 16,
		hideMod : -16
	}
};

function setupMainTab(self, data) {
	if (!data) {
		data = {}
	}

	setupGeneral(self, data);
	setupAbilityScores(self, data);
	setupOtherStatistics(self, data);
	setupAttacks(self, data);
	setupDefense(self, data);
	setupHealth(self, data);
}

function XpEntry(entry) {
	var self = this;
	self.entry = ko.observable(entry);
}

function AbilityScore(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.roll = ko.observable(data.roll);
	self.racial = ko.observable(data.racial);
	self.misc1 = ko.observable(data.misc1);
	self.misc2 = ko.observable(data.misc2);
	self.misc3 = ko.observable(data.misc3);

	self.score = ko.computed(function() {
		var roll = parseInt(self.roll()) || 0;
		var racial = parseInt(self.racial()) || 0;
		var misc1 = parseInt(self.misc1()) || 0;
		var misc2 = parseInt(self.misc2()) || 0;
		var misc3 = parseInt(self.misc3()) || 0;

		var totalScore = roll + racial + misc1 + misc2 + misc3;
		return totalScore;
	});

	self.mod = ko.computed(function() {
		var score = self.score();
		return Math.floor((score - 10) / 2);
	});
}

function setupGeneral(self, data) {
	self.alignments = [ "Lawful Good", "Neutral Good", "Chaotic Good",
			"Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil",
			"Neutral Evil", "Chaotic Evil" ];
	self.sizes = [ "Fine", "Diminutive", "Tiny", "Small", "Medium", "Large",
			"Huge", "Gargantuan", "Colossal" ];

	self.name = ko.observable(data.name);
	self.alignment = ko.observable(data.alignment);
	self.race = ko.observable(data.race);
	self.deity = ko.observable(data.deity);
	self.gender = ko.observable(data.gender);
	self.eyes = ko.observable(data.eyes);
	self.hair = ko.observable(data.hair);
	self.skin = ko.observable(data.skin);
	self.age = ko.observable(data.age);
	self.size = ko.observable(data.size);
	self.height = ko.observable(data.height);
	self.weight = ko.observable(data.weight);
	self.xpEntries = ko.observableArray([]);

	for (i in data.xpEntries) {
		self.xpEntries().push(new XpEntry(data.xpEntries[i].entry));
	}

	self.xpTotal = ko.computed(function() {
		var total = 0;

		for (var i = 0; i < self.xpEntries().length; i++) {
			var entry = parseInt(self.xpEntries()[i].entry()) || 0;
			total += entry;
		}

		return total;
	});

	self.nextLevelXp = ko.computed(function() {
		var nextLevel = self.levels().length + 1;

		return getXpForLevel(nextLevel);
	});

	self.addXp = function() {
		self.xpEntries.push(new XpEntry(0));
	};

	self.sizeMods = ko.computed(function() {
		return sizeMap[self.size()] || sizeMap['Medium'];
		;
	})
}

function setupAbilityScores(self, data) {
	self.abilityScores = ko.observableArray([]);

	if (data.abilityScores) {
		for (i in data.abilityScores) {
			self.abilityScores().push(new AbilityScore(data.abilityScores[i]));
		}
	} else {
		self.abilityScores = ko.observableArray([ new AbilityScore({
			name : "Strength"
		}), new AbilityScore({
			name : "Dexterity"
		}), new AbilityScore({
			name : "Constitution"
		}), new AbilityScore({
			name : "Intelligence"
		}), new AbilityScore({
			name : "Wisdom"
		}), new AbilityScore({
			name : "Charisma"
		}) ]);
	}

	self.abilityMod = function(name) {
		var abilityScores = self.abilityScores();
		for (var i = 0; i < abilityScores.length; i++) {
			var score = abilityScores[i];

			if (name === score.name()) {
				return score.mod();
			}
		}
	}
}

function Attack(parent, data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.alignment = ko.observable(data.alignment);
	self.tempAttackBonus = ko.observable(data.tempAttackBonus);
	self.damage = ko.observable(data.damage);
	self.type = ko.observable(data.type);
	self.range = ko.observable(data.range);
	self.ammunition = ko.observable(data.ammunition);
	self.notes = ko.observable(data.notes);
	self.critical = ko.observable(data.critical);
	self.confirmingDeletion = ko.observable(false);
	self.size = ko.observable(data.size);
	self.ability = ko.observable(data.ability);

	self.attackBonus = ko.computed(function() {
		var tempAttackBonus = parseInt(self.tempAttackBonus()) || 0;
		var strMod = parseInt(parent.abilityMod(self.ability())) || 0;
		var baseAttackBonus = parent.totalBaseAttackBonus();
		var totalAttackMod = baseAttackBonus + strMod + tempAttackBonus;

		var numAttacks = Math.max(1, Math.ceil(parent.babBeforeSizeMod() / 5));
		var attackText = "";

		for (var i = 0; i < numAttacks; i++) {
			attackText += (totalAttackMod - (i * 5)) + "/";
		}

		return attackText.substring(0, attackText.length - 1);
	});

	self.tryDeletion = function() {
		self.confirmingDeletion(true);
	};

	self.cancelDeletion = function() {
		self.confirmingDeletion(false);
	};
}

function Defense(data) {
	var self = this;

	if (!data) {
		data = {}
	}

	self.name = ko.observable(data.name);
	self.acBonus = ko.observable(data.acBonus);
	self.maxDex = ko.observable(data.maxDex);
	self.acp = ko.observable(data.acp);
	self.spellFailurePercent = ko.observable(data.spellFailurePercent);
	self.speed = ko.observable(data.speed);
}

function setupHealth(self, data) {
	self.hpTemp = ko.observable(data.hpTemp);
	self.hpOther = ko.observable(data.hpOther);
	self.damage = ko.observable(data.damage);
	self.nonlethal = ko.observable(data.nonlethal);

	self.hpTotal = ko.computed(function() {
		var conMod = self.abilityMod("Constitution");
		var hpOther = parseInt(self.hpOther()) || 0;
		var numLevels = self.levels().length;
		var hdRolls = self.totalHdRolls();
		var total = hpOther;

		for (i in hdRolls) {
			var levelHp = conMod + hdRolls[i];

			total += Math.max(levelHp, 1);
		}

		return total;
	});

	self.hpCurrent = ko.computed(function() {
		var hpTotal = parseInt(self.hpTotal()) || 0;
		var hpTemp = parseInt(self.hpTemp()) || 0;
		var damage = parseInt(self.damage()) || 0;
		return hpTotal + hpTemp - damage;
	});

	self.hpPercent = ko.computed(function() {
		var hpCurrent = parseInt(self.hpCurrent()) || 0;
		if (hpCurrent < 1) {
			return 0;
		}

		var hpTotal = parseInt(self.hpTotal()) || 0;

		if (hpCurrent >= hpTotal) {
			return 100;
		}

		return Math.trunc(hpCurrent / hpTotal * 100);
	});

	self.healthBadgeInfo = ko.computed(function() {
		var hpCurrent = self.hpCurrent();
		var nonlethal = parseInt(self.nonlethal()) || 0;

		var condition = "Alive";
		var conditionClasses = "label label-success";

		if (hpCurrent > 0) {
			if (hpCurrent == nonlethal) {
				condition = "Staggered";
				conditionClasses = "label label-warning";
			} else if (hpCurrent < nonlethal) {
				condition = "Unconscious";
				conditionClasses = "label label-warning";
			}
		} else if (hpCurrent == 0) {
			condition = "Disabled";
			conditionClasses = "label label-warning";
		} else if (hpCurrent <= -10) {
			condition = "Dead";
			conditionClasses = "label label-danger";
		} else if (hpCurrent < 0) {
			condition = "Dying";
			conditionClasses = "label label-danger";
		}

		return {
			condition : condition,
			conditionClasses : conditionClasses
		};
	});

	self.healthBadgeText = ko.computed(function() {
		return self.healthBadgeInfo().condition;
	});

	self.healthBadgeClasses = ko.computed(function() {
		return self.healthBadgeInfo().conditionClasses;
	});

	self.healthBarClasses = ko.computed(function() {
		var hpPercent = self.hpPercent();

		if (hpPercent >= 50) {
			return "progress-bar progress-bar-success";
		} else if (hpPercent >= 25) {
			return "progress-bar progress-bar-warning";
		} else {
			return "progress-bar progress-bar-danger";
		}
	});
}

function setupOtherStatistics(self, data) {
	self.initiativeTemp = ko.observable(data.initiativeTemp);
	self.fortTemp = ko.observable(data.fortTemp);
	self.refTemp = ko.observable(data.refTemp);
	self.willTemp = ko.observable(data.willTemp);
	self.damageReduction = ko.observable(data.damageReduction);
	self.energyResistance = ko.observable(data.energyResistance);
	self.speed = ko.observable(data.speed);
	self.spellResistance = ko.observable(data.spellResistance);

	self.initiativeTotal = ko.computed(function() {
		var initTemp = parseInt(self.initiativeTemp()) || 0;
		var dexMod = self.abilityMod("Dexterity");

		return initTemp + dexMod;
	});

	self.baseSave = function(save) {
		var total = 0;
		var classTally = {};

		for (i in self.levels()) {
			var className = self.levels()[i].className();
			var thisClass = classTally[className];
			classTally[className] = thisClass ? thisClass + 1 : 1;
		}

		for (className in classTally) {
			var charClass = self.classMap()[className];
			if (!charClass)
				break;
			var saveLevel = "";

			switch (save) {
			case "Fort":
				saveLevel = charClass.baseFortSave();
				break;
			case "Reflex":
				saveLevel = charClass.baseRefSave();
				break;
			case "Will":
				saveLevel = charClass.baseWillSave();
				break;
			}

			total += getSaveBonus(classTally[className], saveLevel)
		}

		return total;
	};

	self.totalBaseFortSave = ko.computed(function() {
		return self.baseSave("Fort");
	});

	self.totalBaseRefSave = ko.computed(function() {
		return self.baseSave("Reflex");
	});

	self.totalBaseWillSave = ko.computed(function() {
		return self.baseSave("Will");
	});

	self.fortSave = ko.computed(function() {
		var fortBase = self.totalBaseFortSave();
		var fortTemp = parseInt(self.fortTemp()) || 0;
		var conMod = self.abilityMod("Constitution");

		return fortBase + fortTemp + conMod;
	});

	self.refSave = ko.computed(function() {
		var refBase = self.totalBaseRefSave();
		var refTemp = parseInt(self.refTemp()) || 0;
		var dexMod = self.abilityMod("Dexterity");

		return refBase + refTemp + dexMod;
	});

	self.willSave = ko.computed(function() {
		var willBase = self.totalBaseWillSave();
		var willTemp = parseInt(self.willTemp()) || 0;
		var wisMod = self.abilityMod("Wisdom");

		return willBase + willTemp + wisMod;
	});
}

function setupAttacks(self, data) {
	self.tempBab = ko.observable(data.tempBab);
	self.tempGrapple = ko.observable(data.tempGrapple);

	self.babBeforeSizeMod = ko.computed(function() {
		var total = 0;
		var classTally = {};
		var tempBab = parseInt(self.tempBab()) || 0;

		for (i in self.levels()) {
			var className = self.levels()[i].className();
			var thisClass = classTally[className];
			classTally[className] = thisClass ? thisClass + 1 : 1;
		}

		for (className in classTally) {
			var charClass = self.classMap()[className];
			if (!charClass)
				break;
			var bab = charClass.baseAttackBonus();
			total += getBaseAttackBonus(classTally[className], bab)
		}

		return total + tempBab;
	});

	self.totalBaseAttackBonus = ko.computed(function() {
		var babBeforeSizeMod = self.babBeforeSizeMod();
		var sizeAttackMod = self.sizeMods().sizeMod;

		return babBeforeSizeMod + sizeAttackMod;
	});

	self.grappleMod = ko.computed(function() {
		var tempGrapple = parseInt(self.tempGrapple()) || 0;
		var attackBonus = self.babBeforeSizeMod();
		var sizeGrappleMod = self.sizeMods().grappleMod;
		var strengthMod = self.abilityMod("Strength");
		var totalGrappleMod = attackBonus + tempGrapple + sizeGrappleMod + strengthMod;

		return totalGrappleMod;
	});

	self.attacks = ko.observableArray([]);

	for (i in data.attacks) {
		self.attacks().push(new Attack(self, data.attacks[i]));
	}

	self.addAttack = function() {
		var attack = new Attack(self, {});
		self.attacks.push(attack);
	};

	self.removeAttack = function(attack) {
		self.attacks.remove(attack)
	};
}

function setupDefense(self, data) {
	self.acTemp = ko.observable(data.acTemp);
	self.touchAcTemp = ko.observable(data.touchAcTemp);
	self.flatFootedAcTemp = ko.observable(data.flatFootedAcTemp);

	self.armor = ko.observable(new Defense(data.armor));
	self.shield = ko.observable(new Defense(data.shield));

	self.totalAcp = ko.computed(function() {
		var armorAcp = parseInt(self.armor().acp()) || 0;
		var shieldAcp = parseInt(self.shield().acp()) || 0;

		return armorAcp + shieldAcp;
	});

	self.totalSpellFailurePercent = ko.computed(function() {
		var armorPercent = parseInt(self.armor().spellFailurePercent()) || 0;
		var shieldPercent = parseInt(self.shield().spellFailurePercent()) || 0;

		return armorPercent + shieldPercent;
	});

	self.dexAcBonus = ko.computed(function() {
		var dexMod = self.abilityMod("Dexterity");

		var armorMaxDex = parseInt(self.armor().maxDex());
		var shieldMaxDex = parseInt(self.shield().maxDex());

		if (null != armorMaxDex && !isNaN(armorMaxDex)) {
			dexMod = Math.min(dexMod, armorMaxDex);
		}

		if (null != shieldMaxDex && !isNaN(shieldMaxDex)) {
			dexMod = Math.min(dexMod, shieldMaxDex);
		}

		return dexMod;
	});

	self.touchAcBonus = ko.computed(function() {
		var touchAcTemp = parseInt(self.touchAcTemp()) || 0;
		var dexMod = self.dexAcBonus();

		return touchAcTemp + dexMod;
	});

	self.flatFootedAcBonus = ko.computed(function() {
		var flatFootedAcTemp = parseInt(self.flatFootedAcTemp()) || 0;
		var armorAc = parseInt(self.armor().acBonus()) || 0;
		var shieldAc = parseInt(self.shield().acBonus()) || 0;

		var dexMod = self.dexAcBonus();
		if (dexMod > 0) {
			// positive dexMod doesn't count towards FF
			dexMod = 0;
		}

		return flatFootedAcTemp + armorAc + shieldAc + dexMod;
	});

	self.acTotal = ko.computed(function() {
		var acTemp = parseInt(self.acTemp()) || 0;
		var sizeAcMod = self.sizeMods().sizeMod;

		var dexMod = self.dexAcBonus();
		var armorAc = parseInt(self.armor().acBonus()) || 0;
		var shieldAc = parseInt(self.shield().acBonus()) || 0;

		return 10 + acTemp + dexMod + armorAc + shieldAc + sizeAcMod;
	});

	self.touchAcTotal = ko.computed(function() {
		var sizeAcMod = self.sizeMods().sizeMod;
		return 10 + self.touchAcBonus() + sizeAcMod;
	});

	self.flatFootedAcTotal = ko.computed(function() {
		var sizeAcMod = self.sizeMods().sizeMod;
		return 10 + self.flatFootedAcBonus() + sizeAcMod;
	});
}

function getXpForLevel(level) {
	var total = 0;

	for (var i = level - 1; i > 0; i--) {
		total += i * 1000;
	}

	return total;
}

function getBaseAttackBonus(classLevel, bonusLevel) {
	var avgAttacks = [ 0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12,
			13, 14, 15 ];

	switch (bonusLevel) {
	case "Good":
		return classLevel;
		break;
	case "Average":
		return avgAttacks[classLevel - 1];
		break;
	case "Poor":
		return Math.floor(classLevel / 2);
		break;
	}
}

function getSaveBonus(classLevel, bonusLevel) {
	var result = 0;
	switch (bonusLevel) {
	case "Good":
		result = (classLevel / 2) + 2;
		break;
	case "Poor":
		result = classLevel / 3;
		break;
	}

	return Math.floor(result);
}
