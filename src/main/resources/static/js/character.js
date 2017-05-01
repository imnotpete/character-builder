$(document).ready(setup);

function setup() {
	$('input').change(recalculateAll);

	recalculateAll();
}