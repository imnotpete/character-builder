function setupMainTab(self) {
	setupGeneral(self);
	setupAbilityScores(self);
	setupHealth(self);
	setupOtherStatistics(self);
	setupAttacks(self);
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

function setupGeneral(self) {
	self.name = ko.observable();
	self.alignment = ko.observable();
	self.race = ko.observable();
	self.deity = ko.observable();
	self.gender = ko.observable();
	self.eyes = ko.observable();
	self.hair = ko.observable();
	self.skin = ko.observable();
	self.age = ko.observable();
	self.size = ko.observable();
	self.height = ko.observable();
	self.weight = ko.observable();
	self.xpEntries = ko.observableArray([]);

	self.xpTotal = ko.computed(function() {
		var total = 0;

		for (var i = 0; i < self.xpEntries().length; i++) {
			var entry = parseInt(self.xpEntries()[i].entry()) || 0;
			total += entry;
		}

		return total;
	});

	self.nextLevelXp = ko.computed(function() {
		var nextLevel = 2;

		return getXpForLevel(nextLevel);
	});

	self.addXp = function() {
		self.xpEntries.push(new XpEntry(0));
	};
}

function setupAbilityScores(self) {
	self.abilityScores = ko.observableArray([ new AbilityScore({
		name : "Strength",
		roll : "",
		racial : "",
		misc1 : "",
		misc2 : "",
		misc3 : ""
	}), new AbilityScore({
		name : "Dexterity",
		roll : "",
		racial : "",
		misc1 : "",
		misc2 : "",
		misc3 : ""
	}), new AbilityScore({
		name : "Constitution",
		roll : "",
		racial : "",
		misc1 : "",
		misc2 : "",
		misc3 : ""
	}), new AbilityScore({
		name : "Intelligence",
		roll : "",
		racial : "",
		misc1 : "",
		misc2 : "",
		misc3 : ""
	}), new AbilityScore({
		name : "Wisdom",
		roll : "",
		racial : "",
		misc1 : "",
		misc2 : "",
		misc3 : ""
	}), new AbilityScore({
		name : "Charisma",
		roll : "",
		racial : "",
		misc1 : "",
		misc2 : "",
		misc3 : ""
	}) ]);

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

function setupHealth(self) {
	self.hpTemp = ko.observable();
	self.damage = ko.observable();
	self.nonlethal = ko.observable();

	self.hpTotal = ko.computed(function() {
		var conMod = self.abilityMod("Constitution");
		var hpTemp = parseInt(self.hpTemp()) || 0;

		return conMod + hpTemp;
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
}

function setupOtherStatistics(self) {
	self.acTemp = ko.observable();
	self.touchAcTemp = ko.observable();
	self.flatFootedAcTemp = ko.observable();
	self.initiativeTemp = ko.observable();
	self.fortTemp = ko.observable();
	self.refTemp = ko.observable();
	self.willTemp = ko.observable();
	self.damageReduction = ko.observable();
	self.speed = ko.observable();
	self.spellResistance = ko.observable();

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

function setupAttacks(self) {
	self.attacks = ko.observableArray([]);
	
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