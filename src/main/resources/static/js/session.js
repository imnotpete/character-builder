var sessionTimeoutRefreshMillis;
var timeoutId;

function resetSessionTimer() {
	console.log("Resetting session timer.");
	window.clearTimeout(timeoutId);
	timeoutId = window.setTimeout(refreshSession, sessionTimeoutRefreshMillis);
}

function refreshSession() {
	$.get("/api/users/loggedin").fail(function() {
		var retry = window.confirm("Unable to refresh HTTP session. Retry?");
		if (result) {
			refreshSession();
		}
	});
}

function setupSessionTimeout() {
	var sessionTimeout = parseInt($("#sessionTimeout").val()) || 0;
	if (sessionTimeout == 0) {
		console.log("Session timeout is zero -- no timer set");
	} else {
		var sessionTimeoutRefreshSeconds = sessionTimeout - 120;
		sessionTimeoutRefreshMillis = sessionTimeoutRefreshSeconds * 1000;
		
		console.log("Session timeout is " + sessionTimeout
				+ " seconds. Setting timer to " + sessionTimeoutRefreshSeconds
				+ " seconds.");
		
		$(document).ajaxSuccess(resetSessionTimer);

		// kick it off the first time
		resetSessionTimer();
	}
}