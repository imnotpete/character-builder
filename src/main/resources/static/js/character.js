$(document).ready(setup);

function setup() {
	$('input').change(recalculateAll);
	$('#addAttackButton').click(addAttack);
	$('#addLevelButton').click(addLevel);
	recalculateAll();
}

function addAttack() {
	var attacks = $('#attacks');
	var newAttack = $('#attackTemplate').clone();
	attacks.append(newAttack);
	newAttack.show();
	newAttack.find(".deleteAttack").click(deleteListGroupItem);
}

function addLevel() {
	var levels = $('#levelsContainer');
	var newLevel = $('#levelTemplate').clone();
	levels.append(newLevel);
	newLevel.show();
	newLevel.find(".deleteLevel").click(deleteListGroupItem);
}

function deleteListGroupItem() {
	$(this).parents('.list-group-item').remove();
}