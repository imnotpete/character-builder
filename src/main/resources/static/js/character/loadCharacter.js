function loadCharacter(id) {
	$.get("characters/" + id, populateFields).fail(fail);
}

function populateFields(character) {
//	$('')
}

function fail(xhr, code, message) {
	alert("failed to load data");
}