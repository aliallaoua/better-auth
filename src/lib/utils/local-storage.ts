export function getItem<T>(key: string): T | null {
	try {
		const item = localStorage.getItem(key);
		return item ? (JSON.parse(item) as T) : null;
	} catch (error) {
		console.error(`Error getting item '${key}' from localStorage:`, error);
		return null;
	}
}

export function setItem<T>(key: string, value: T) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Error setting item '${key}' in localStorage:`, error);
	}
}

export const removeItem = (key: string) => {
	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		console.log(error);
	}
};
