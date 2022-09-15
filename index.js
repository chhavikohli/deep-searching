// function (keyword,artifacts)
// flatten artifacts
// filter flattened data
// revert to array

const flatten = require("./flatten");

/**
 * It performs searching on input artifacts
 * @param {string} keyword - search string
 * @param {array} artifacts - nested array or object
 * @param {*} options[optional] - exclude(array of keys that needs to be excluded while searching)
 */
function deepSearch(
	keyword,
	artifacts,
	options = { exclude: [], searchByKey: "" }
) {
	let filteredKeyValue = {};
	let expandedResult = [];
	// flatten array of object
	const flatObject = flatten(artifacts);

	// Extract all the keys of flatten objects
	let flatKeys = Object.keys(flatObject);
	let keys = flatKeys.map((key) => {
		return extractKey(key);
	});

	// Remove duplicate keys
	keys = [...new Set(keys)];

	// Perform searching on nested array only on include keys.
	let filteredResults = Object.keys(flatObject).filter((key) => {

		const attributeKey = extractKey(key);
		const shouldExclude = options.exclude && options.exclude.indexOf(attributeKey) > -1;
		if (shouldExclude) {
			return false;
		}
		if (!flatObject[key]) {
			return false;
		}
		const isMatching = flatObject[key].toString().toLowerCase().includes(keyword.toLowerCase());
		if (options.searchByKey && options.searchByKey.trim() === attributeKey && isMatching) {
			// Searching obn fixed key attribute
			return true;
		}
		if (!options.searchByKey && isMatching) {
			// Searching on all the keys except keys that are passed in excludeArray.
			return true;
		}

	});

	filteredResults.map((result) => {
		let splitFlattenIndex = result.split(".");
		const length = splitFlattenIndex.length;
		for (let i = 0; i < length; i++) {
			if (i % 2 === 0) {
				for (let key of keys) {
					let string = "";
					for (let j = i; j > -1; j--) {
						string = `${splitFlattenIndex[j]}.${string}`;
					}
					expandedResult.push(`${string}${key}`);
				}
			}
		}
	});

	// Remove duplicate
	expandedResult = [...new Set(expandedResult)];

	// Get key value pair
	expandedResult = expandedResult.map((f) => {
		if (typeof flatObject[f] !== "undefined") {
			filteredKeyValue[f] = flatObject[f];
		}
	});

	// unflatten result and return filtered data
	return flatten.unflatten(filteredKeyValue);
}

function extractKey(key) {
	const splitKey = key.split(".");
	const last = splitKey.pop();
	const secondLast = splitKey.pop();
	if (isNaN(Number(secondLast))) {
		return `${secondLast}.${last}`;
	} else {
		return last;
	}
}

function clean(object) {
	Object.entries(object)
		.slice()
		.reverse()
		.forEach(([k, v]) => {
			console.log('----kkkk---',k)
			console.log('----vvvv---',v)
			if (v && typeof v === "object") {
				clean(v);
			}
			if (
				(v && typeof v === "object" && !Object.keys(v).length) ||
				v === null ||
				v === undefined || !v
			) {
				if (Array.isArray(object)) {
					object.splice(k--, 1);
				} else {
					delete object[k];

				}
			}
		});
	return object;
}

module.exports = {
	deepSearch,
	clean
}

