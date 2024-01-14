const url = process.env.ETHS_API_BASE;
const sender_id = process.env.ETHS_FIREBASE_TOKEN;
const serial = 'test';

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	if (reason !== 'install') {
		return;
	}
	registerFirebase();
});

function registerFirebase() {
	chrome.gcm.register([sender_id], firebaseCallback);
}

let firebaseCallback = async function (alertToken) {
	const response = await fetch(`${url}/api/v1/ext/register`, {
		method: 'POST',
		body: JSON.stringify({ serial: serial, alertToken: alertToken }),
	});
	if (response.status === 200) {
		chrome.storage.local
			.set({
				deviceStatus: response.data.deviceStatus,
				loanerStatus: response.data.loanerStatus,
				startDate: response.data.startDate,
			})
			.then(() => {
				console.log('Value is set');
			});
	}
};
