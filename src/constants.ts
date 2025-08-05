import type { FirebaseOptions } from 'firebase/app';

export const API_BASE = process.env.ETHS_API_BASE;
export const SENDER_ID = process.env.ETHS_FIREBASE_TOKEN;

export const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.ETHS_FIREBASE_API_KEY,
	projectId: process.env.ETHS_FIREBASE_PROJECT_ID,
	messagingSenderId: process.env.ETHS_FIREBASE_TOKEN,
	appId: process.env.ETHS_FIREBASE_APP_ID,
	measurementId: process.env.ETHS_FIREBASE_MEASUREMENT_ID,
};

export const ALARMS = {
	Registration: {
		periodInMinutes: 2,
		delayInMinutes: 0,
	},
	Ping: {
		periodInMinutes: 2,
		delayInMinutes: 1,
	},
};
