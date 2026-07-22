/**
 * Loads a json.
 * @param {string} config_path 
 * @returns {Promise<Object>}
 */
async function load_json(relative_path) {
	try {
		const response = await fetch(relative_path);

		if (!response.ok) {
			throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Config Loader Error:", error);
		return {};
	}
}


const formatString = (str, obj) =>
	str.replace(/\${(\w+)}/g, (match, key) => key in obj ? obj[key] : match);


function isMobileDevice() {
	// Check modern API first
	if (navigator.userAgentData) {
		return navigator.userAgentData.mobile;
	}

	// Fallback for Safari and older browsers
	return window.matchMedia("(pointer: coarse)").matches ||
		/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}


function isDeviceSlow() {
	const start = performance.now();
	const timeout = 20;
	const max_time = start + timeout;

	// Run an intensive math loop
	let x = 0;
	for (let j = 0; j < 10; j++) {
		for (let i = 0; i < 50000; i++) {
			x += Math.sqrt(i) * Math.sin(i);
		}
		if(performance.now() > max_time)
			return true;
	}

	// passed
	return false;
}
