export function getSerial(): Promise<string> {
	return new Promise((resolve) => {
		chrome.enterprise.deviceAttributes.getDeviceSerialNumber((sn) =>
			resolve(sn)
		);
	});
}
export function getUser(): Promise<{ email: string; id: string }> {
	return new Promise((resolve) => {
		chrome.identity.getProfileUserInfo((user) => resolve(user));
	});
}
export function registerFirebase(sender_id: string): Promise<string> {
	return new Promise((resolve) => {
		chrome.gcm.register([sender_id], (firebaseToken) => resolve(firebaseToken));
	});
}
export function environmentIsSupported() {
	return !!chrome.enterprise?.deviceAttributes;
}
export function getStoredProperty(key: string): Promise<any> {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (data) => {
			resolve(data[key]);
		});
	});
}
