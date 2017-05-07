function setupMainTab(self, data) {
	if (!data) {
		data = {}
	}

	setupGeneral(self, data);
	setupAbilityScores(self, data);
	setupOtherStatistics(self, data);
	setupAttacks(self, data);
	setupHealth(self, data);
}

function XpEntry(entry) {
	var self = this;
	self.entry = ko.observable(entry);
}

function Attack(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.alignment = ko.observable(data.alignment);
	self.attackBonus = ko.observable(data.attackBonus);
	self.damage = ko.observable(data.damage);
	self.type = ko.observable(data.type);
	self.range = ko.observable(data.range);
	self.ammunition = ko.observable(data.ammunition);
	self.notes = ko.observable(data.notes);
	self.confirmingDeletion = ko.observable(false);
	self.size = ko.observable(data.size);

	self.tryDeletion = function() {
		self.confirmingDeletion(true);
	};

	self.cancelDeletion = function() {
		self.confirmingDeletion(false);
	};
}

function AbilityScore(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.roll = ko.observable(data.roll);
	self.racial = ko.observable(data.racial);
	self.misc1 = ko.observable(data.misc1);
	self.misc2 = ko.observable(data.misc2);
	self.misc3 = ko.observable(data.misc3);

	self.mod = ko.computed(function() {
		var roll = parseInt(self.roll()) || 0;
		var racial = parseInt(self.racial()) || 0;
		var misc1 = parseInt(self.misc1()) || 0;
		var misc2 = parseInt(self.misc2()) || 0;
		var misc3 = parseInt(self.misc3()) || 0;

		var totalScore = roll + racial + misc1 + misc2 + misc3;
		return Math.floor((totalScore - 10) / 2);
	});
}

function setupGeneral(self, data) {
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
		var nextLevel = self.levels().length+1;

		return getXpForLevel(nextLevel);
	});

	self.addXp = function() {
		self.xpEntries.push(new XpEntry(0));
	};
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

function setupHealth(self, data) {
	self.hpTemp = ko.observable(data.hpTemp);
	self.damage = ko.observable(data.damage);
	self.nonlethal = ko.observable(data.nonlethal);

	self.hpTotal = ko.computed(function() {
		var conMod = self.abilityMod("Constitution");
		var hpTemp = parseInt(self.hpTemp()) || 0;
		var numLevels = self.levels().length;
		var totalHdRolls = self.totalHdRolls();

		return (numLevels * conMod) + hpTemp + totalHdRolls;
	});

	self.hpCurrent = ko.computed(function() {
		var hpTotal = parseInt(self.hpTotal()) || 0;
		var damage = parseInt(self.damage()) || 0;
		return hpTotal - damage;
	});

	self.hpPercent = ko.computed(function() {
		var hpCurrent = parseInt(self.hpCurrent()) || 0;
		if (hpCurrent < 1) {
			return 0;
		}

		var hpTotal = parseInt(self.hpTotal()) || 0;
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
		
		return {condition : condition, conditionClasses : conditionClasses};
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
	self.acTemp = ko.observable(data.acTemp);
	self.touchAcTemp = ko.observable(data.touchAcTemp);
	self.flatFootedAcTemp = ko.observable(data.flatFootedAcTemp);
	self.initiativeTemp = ko.observable(data.initiativeTemp);
	self.fortTemp = ko.observable(data.fortTemp);
	self.refTemp = ko.observable(data.refTemp);
	self.willTemp = ko.observable(data.willTemp);
	self.damageReduction = ko.observable(data.damageReduction);
	self.speed = ko.observable(data.speed);
	self.spellResistance = ko.observable(data.spellResistance);

	self.acTotal = ko.computed(function() {
		var acTemp = parseInt(self.acTemp()) || 0;
		var dexMod = self.abilityMod("Dexterity");

		return acTemp + dexMod;
	});

	self.touchAcTotal = ko.computed(function() {
		var touchAcTemp = parseInt(self.touchAcTemp()) || 0;
		var dexMod = self.abilityMod("Dexterity");

		return touchAcTemp + dexMod;
	});

	self.flatFootedAcTotal = ko.computed(function() {
		var flatFootedAcTemp = parseInt(self.flatFootedAcTemp()) || 0;

		return flatFootedAcTemp;
	});

	self.initiativeTotal = ko.computed(function() {
		var initTemp = parseInt(self.initiativeTemp()) || 0;
		var dexMod = self.abilityMod("Dexterity");

		return initTemp + dexMod;
	});

	self.fortSave = ko.computed(function() {
		var fortTemp = parseInt(self.fortTemp()) || 0;
		var conMod = self.abilityMod("Constitution");

		return fortTemp + conMod;
	});

	self.refSave = ko.computed(function() {
		var refTemp = parseInt(self.refTemp()) || 0;
		var dexMod = self.abilityMod("Dexterity");

		return refTemp + dexMod;
	});

	self.willSave = ko.computed(function() {
		var willTemp = parseInt(self.willTemp()) || 0;
		var wisMod = self.abilityMod("Wisdom");

		return willTemp + wisMod;
	});
}

function setupAttacks(self, data) {
	self.attacks = ko.observableArray([]);

	for (i in data.attacks) {
		self.attacks().push(new Attack(data.attacks[i]));
	}

	self.addAttack = function() {
		var attack = new Attack({});
		self.attacks.push(attack);
	};

	self.removeAttack = function(attack) {
		self.attacks.remove(attack)
	};
}

function getXpForLevel(level) {
	var total = 0;

	for (var i = level - 1; i > 0; i--) {
		total += i * 1000;
	}

	return total;
}