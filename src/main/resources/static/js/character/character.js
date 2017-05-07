$(document).ready(setup);

function setup() {
	$('input').change(recalculateAll);
	$('#addAttackButton').click(addAttack);
	$('#addLevelButton').click(addLevel);
	$('#deleteConfirmationDialog').on('show.bs.modal', setupDeletionModal);

	$('.sortable').each(function() {
		Sortable.create($(this)[0], {
			animation : 150
		});
	});

	recalculateAll();
}

function addAttack() {
	var attacks = $('#attacks');
	var newAttack = $('#attackTemplate').clone();

	newAttack.attr('id', '');
	attacks.append(newAttack);
	newAttack.show();
}

function addLevel() {
	var levels = $('#levels');
	var newLevel = $('#levelTemplate').clone();

	newLevel.attr('id', '');
	levels.append(newLevel);
	newLevel.show();
}

function setupDeletionModal(event) {
	var button = $(event.relatedTarget) // Button that triggered the modal

	var deletetype = button.data('deletetype');
	$('#deleteConfirmationDialog').find('.deletetype').text(deletetype);

	$('#deleteConfirmationButton').click(function() {
		button.parents('.list-group-item').remove();
	})
}