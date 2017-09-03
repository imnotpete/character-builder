function setupSpellsTab(self, data) {
	if (!data) {
		data = {}
	}

	self.spells = ko.observableArray([]);

	for (i in data.spells) {
		self.spells().push(new Spell(data.spells[i]))
	}
	
	self.addSpell = function() {
		var spell = new Spell({});
		self.spells().push(spell);
	};

	self.removeSpell = function(spell) {
		self.spells().remove(spell)
	};
}

function Spell(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.level = ko.observable(data.hdRoll);
	self.persistable = ko.observable(data.hdRoll);
	self.uses = ko.observable(data.hdRoll);
	self.description = ko.observable(data.hdRoll);
	self.components = ko.observable(data.hdRoll);
	self.castingTime = ko.observable(data.hdRoll);
	self.range = ko.observable(data.hdRoll);
	self.duration = ko.observable(data.hdRoll);
	self.save = ko.observable(data.hdRoll);
	self.spellResistance = ko.observable(data.hdRoll);
	
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