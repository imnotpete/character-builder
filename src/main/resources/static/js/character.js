$(document).ready(setup);

function setup() {
	$('input').change(recalculateAll);
	$('#addAttackButton').click(addAttack);
	recalculateAll();
}

function addAttack() {
	var attacks = $('#attacks');
	var newAttack = $('#attackTemplate').clone();
	attacks.append(newAttack);
	newAttack.show();
}

function deleteAttack() {
	
}