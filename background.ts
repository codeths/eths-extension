// const url = process.env.ETHS_API_BASE;
const url =
	'https://f565-2600-1700-b350-5d80-4aa9-b89f-6f5f-132a.ngrok-free.app';
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
function getUser(): Promise<{ email: string; id: string }> {
	return new Promise((resolve) => {
		chrome.identity.getProfileUserInfo((user) => resolve(user));
	});
}

let firebaseCallback = async function (alertToken: string) {
	const serial = await getSerial();
	const { email, id } = await getUser();
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
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			serial,
			alertToken,
			email,
			googleID: id,
		}),
	});
	if (response.status === 200) {
		const { status } = await response.json();
		chrome.storage.local.set(status).then(() => {
			console.log('Value is set');
		});
	}
};
