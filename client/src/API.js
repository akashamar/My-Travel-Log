const API_URL = "https://log-entries.herokuapp.com";

export async function listLogEntries() {
	const response = await fetch(`${API_URL}/api/logs`);
	return response.json();
}

export async function createLogEntry(entry) {
	const apiKey = entry.apiKey;
	delete entry.apiKey;
	const response = await fetch(`${API_URL}/api/logs`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"X-API-KEY": apiKey,
		},
		body: JSON.stringify(entry),
	});
	const json = await response.json();
	if (response.ok) {
		return json
	}
	const error = new Error(json.message)
	error.response = json;
	throw error;
}
