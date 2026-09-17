const localHosts = ["localhost", "127.0.0.1", "[::1]"];

window.RURALCARE_API_URL = localHosts.includes(window.location.hostname)
	? "http://127.0.0.1:8000"
	: "/api";