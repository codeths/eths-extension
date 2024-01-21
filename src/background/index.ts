import {
	ALARMS,
	environmentIsSupported,
	getSerial,
	getStoredProperty,
	getUser,
	registerFirebase,
} from './utils';

const url = process.env.ETHS_API_BASE;
const sender_id = process.env.ETHS_FIREBASE_TOKEN;

chrome.alarms.onAlarm.addListener(async ({ name }) => {
	switch (name) {
		case 'Registration':
			console.log('registration alarm!!');
			const registered = await getStoredProperty('registered');
			if (!registered && environmentIsSupported()) {
				await register();
			}
			break;
		case 'Ping':
			console.log('ping alarm!!');
			break;
	}
});

async function bootstrap() {
	const allAlarms = await chrome.alarms.getAll();
	for (const [name, options] of Object.entries(ALARMS)) {
		const exists = allAlarms.find((alarm) => alarm.name === name);

		if (!exists) {
			chrome.alarms.create(name, options);
			console.log(`Created an alarm called "${name}"`);
		}
	}
}

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
		const {
			status: { deviceStatus, loanerStatus, startDate },
		} = await response.json();
		chrome.storage.local.set(
			{ deviceStatus, loanerStatus, startDate, registered: true },
			() => {
				console.log('Registration complete');
			}
		);
	}
};

bootstrap();
