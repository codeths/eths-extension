import {
	environmentIsSupported,
	getSerial,
	getUser,
	registerFirebase,
} from './utils';

const url = process.env.ETHS_API_BASE;
const sender_id = process.env.ETHS_FIREBASE_TOKEN;

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	if (reason !== 'install') {
		return;
	}

	if (environmentIsSupported()) {
		register();
	} else {
		console.log('Platform is unsupported, skipping registration');
	}
});

let register = async function () {
	const alertToken = await registerFirebase(sender_id);
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
	if (response.status === 201) {
		const { status } = await response.json();
		chrome.storage.local.set(status).then(() => {
			console.log('Value is set');
		});
	}
};
