
	$(document).ready(setup);

	function setup() {
		$('input').change(recalculateAll);
		
		recalculateAll();
	}
	
	function recalculateAll() {
		recalculateMods();
		recalculateHp();
		recalculateAttacks();
		recalculateXp();
	}
	
	function recalculateMods() {
		recalculateMod('str');
		recalculateMod('dex');
		recalculateMod('con');
		recalculateMod('int');
		recalculateMod('wis');
		recalculateMod('cha');
	}
	
	function recalculateMod(prefix) {
		var roll = parseInt($("#" + prefix + "Roll").val()) || 0;
		var racial = parseInt($("#" + prefix + "Racial").val()) || 0;
		var misc1 = parseInt($("#" + prefix + "Misc1").val()) || 0;
		var misc2 = parseInt($("#" + prefix + "Misc2").val()) || 0;
		var misc3 = parseInt($("#" + prefix + "Misc3").val()) || 0;
		var score = roll + racial + misc1 + misc2 + misc3;
		var mod = (score - 10) / 2;
		
		var element = $("#" + prefix + "Mod");
		element.val(Math.trunc(mod));
		element.prop('title', 'Score: ' + score);
	}
	
	function recalculateHp() {
		
	}
	
	function recalculateAttacks() {
		
	}
	
	function recalculateXp() {
//		alert("xp recalculated");
	}