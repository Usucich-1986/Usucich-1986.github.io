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
