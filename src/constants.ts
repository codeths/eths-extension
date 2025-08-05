// @ts-ignore
export const API_BASE: string = process.env.ETHS_API_BASE;
// @ts-ignore
export const SENDER_ID: string = process.env.ETHS_FIREBASE_TOKEN;

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
