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
	var button = $(this);
	$("#dialog-confirm").dialog({
		resizable : false,
		height : "auto",
		width : 400,
		modal : true,
		buttons : {
			"Delete" : function() {
				confirmDeleteListGroupItem(button);
				$(this).dialog("close");
			},
			Cancel : function() {
				$(this).dialog("close");
			}
		}
	});
}

function confirmDeleteListGroupItem(button) {
	button.parents('.list-group-item').remove();
}