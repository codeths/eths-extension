const url = process.env.ETHS_API_BASE;
const sender_id = process.env.ETHS_FIREBASE_TOKEN;
// const serial = 'test';

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	if (reason !== 'install') {
		return;
	}
	registerFirebase();
});

function registerFirebase() {
	chrome.gcm.register([sender_id], firebaseCallback);
}
function getSerial(): Promise<string> {
	return new Promise((resolve) => {
		chrome.enterprise.deviceAttributes.getDeviceSerialNumber((sn) =>
			resolve(sn)
		);
	});
}

let firebaseCallback = async function (alertToken) {
	const serial = await getSerial();
	const response: Omit<Response, 'json'> & {
		json: () => Promise<{
			status: {
				deviceStatus: string;
				loanerStatus: string;
				startDate: string;
			};
		}>;
	} = await fetch(`${url}/api/v1/ext/register`, {
		method: 'POST',
		body: JSON.stringify({ serial: serial, alertToken: alertToken }),
	});
	if (response.status === 200) {
		const { status } = await response.json();
		chrome.storage.local.set(status).then(() => {
			console.log('Value is set');
		});
	}
};
