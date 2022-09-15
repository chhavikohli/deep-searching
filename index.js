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
	console.log("---hello--->> ", JSON.stringify(object))
	return object;
}

const excludedData = [
	'id',
	'backlog',
	'color',
	'estimate',
	'businessValue',
	'score',
	'order',
	'jiraId',
	'jiraKey',
	'jiraSelf',
	'teamId',
	'userId',
	'initiativeId',
	'timeBoxPlanningId',
	'businessObjectiveId',
	'businessGoal',
	'dueDate',
	'remainingTime',
	'storyPoint',
];

let data = {
	"success": true,
	"data": [{
		"persona": [],
		"id": 243,
		"summary": "story-1",
		"description": "",
		"order": 1,
		"userId": 0,
		"externalKey": "US-31",
		"color": "#ffb64f",
		"initiativeId": "542",
		"backlog": true,
		"progress": "to-do",
		"tags": null,
		"timeBoxPlanningId": null,
		"businessObjectiveId": null,
		"businessGoal": "",
		"dueDate": null,
		"remainingTime": "0.00",
		"storyPoint": 0,
		"jiraId": null,
		"jiraKey": null,
		"jiraSelf": null,
		"teamId": 0,
		"user": null
	}, {
		"id": 7,
		"summary": "epic-one",
		"backlog": true,
		"description": null,
		"externalKey": "EP-7",
		"color": "#ffb64f",
		"estimate": null,
		"score": null,
		"businessValue": null,
		"order": 5,
		"progress": "to-do",
		"jiraId": null,
		"jiraKey": null,
		"jiraSelf": null,
		"teamId": 0,
		"user": null,
		"features": [{
			"id": 4,
			"summary": "feature-three",
			"description": null,
			"userId": 0,
			"externalKey": "FE-4",
			"color": "#ffb64f",
			"estimate": null,
			"businessValue": null,
			"score": null,
			"order": null,
			"progress": "to-do",
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": null,
			"userStories": [{
				"persona": [],
				"id": 244,
				"summary": "userstory1",
				"description": "",
				"order": 32,
				"userId": 0,
				"externalKey": "US-32",
				"color": "#ffb64f",
				"initiativeId": "542",
				"backlog": true,
				"progress": "to-do",
				"tags": null,
				"timeBoxPlanningId": null,
				"businessObjectiveId": null,
				"businessGoal": "",
				"dueDate": null,
				"remainingTime": "0.00",
				"storyPoint": 0,
				"jiraId": null,
				"jiraKey": null,
				"jiraSelf": null,
				"teamId": 0,
				"user": null
			}, {
				"persona": [],
				"id": 245,
				"summary": "threeuserstory",
				"description": "",
				"order": 33,
				"userId": 0,
				"externalKey": "US-33",
				"color": "#ffb64f",
				"initiativeId": "542",
				"backlog": true,
				"progress": "to-do",
				"tags": null,
				"timeBoxPlanningId": null,
				"businessObjectiveId": null,
				"businessGoal": "",
				"dueDate": null,
				"remainingTime": "0.00",
				"storyPoint": 0,
				"jiraId": null,
				"jiraKey": null,
				"jiraSelf": null,
				"teamId": 0,
				"user": null
			}]
		}],
		"userStories": []
	}, {
		"id": 3,
		"summary": "feature-two",
		"description": null,
		"userId": 0,
		"externalKey": "FE-3",
		"color": "#ffb64f",
		"estimate": null,
		"businessValue": null,
		"score": null,
		"order": 6,
		"progress": "to-do",
		"jiraId": null,
		"jiraKey": null,
		"jiraSelf": null,
		"teamId": 0,
		"user": null,
		"userStories": [{
			"persona": [],
			"id": 231,
			"summary": "jkld",
			"description": "<p>eetest</p>",
			"order": 19,
			"userId": 0,
			"externalKey": "US-19",
			"color": "#ffb64f",
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": 23,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 177,
			"user": null
		}, {
			"persona": [],
			"id": 232,
			"summary": "lk",
			"description": "<p>hello</p>",
			"order": 20,
			"userId": 804,
			"externalKey": "US-20",
			"color": "#ffb64f",
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": "2022-09-26",
			"remainingTime": "233.00",
			"storyPoint": 23,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 177,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 233,
			"summary": "f",
			"description": null,
			"order": 21,
			"userId": 804,
			"externalKey": "US-21",
			"color": "#ffb64f",
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 236,
			"summary": null,
			"description": "56",
			"order": 24,
			"userId": 804,
			"externalKey": "US-24",
			"color": null,
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 237,
			"summary": null,
			"description": "78",
			"order": 25,
			"userId": 804,
			"externalKey": "US-25",
			"color": null,
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 238,
			"summary": null,
			"description": "910",
			"order": 26,
			"userId": 804,
			"externalKey": "US-26",
			"color": null,
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}],
		"features": [{
			"persona": [],
			"id": 231,
			"summary": "jkld",
			"description": "<p>eetest</p>",
			"order": 19,
			"userId": 0,
			"externalKey": "US-19",
			"color": "#ffb64f",
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": 23,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 177,
			"user": null
		}, {
			"persona": [],
			"id": 232,
			"summary": "lk",
			"description": "<p>hello</p>",
			"order": 20,
			"userId": 804,
			"externalKey": "US-20",
			"color": "#ffb64f",
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": "2022-09-26",
			"remainingTime": "233.00",
			"storyPoint": 23,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 177,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 233,
			"summary": "f",
			"description": null,
			"order": 21,
			"userId": 804,
			"externalKey": "US-21",
			"color": "#ffb64f",
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 236,
			"summary": null,
			"description": "56",
			"order": 24,
			"userId": 804,
			"externalKey": "US-24",
			"color": null,
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 237,
			"summary": null,
			"description": "78",
			"order": 25,
			"userId": 804,
			"externalKey": "US-25",
			"color": null,
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}, {
			"persona": [],
			"id": 238,
			"summary": null,
			"description": "910",
			"order": 26,
			"userId": 804,
			"externalKey": "US-26",
			"color": null,
			"initiativeId": "542",
			"backlog": true,
			"progress": "to-do",
			"tags": null,
			"timeBoxPlanningId": null,
			"businessObjectiveId": null,
			"businessGoal": null,
			"dueDate": null,
			"remainingTime": null,
			"storyPoint": null,
			"jiraId": null,
			"jiraKey": null,
			"jiraSelf": null,
			"teamId": 0,
			"user": {
				"id": 804,
				"profileImage": "https://lh3.googleusercontent.com/a/AItbvmlF6HtjQbAQcR5PlrwcT9WT0JTpSlsaS16CPy5S=s96-c",
				"displayName": "Chhavi Kohli",
				"firstName": "Chhavi",
				"lastName": "Kohli"
			}
		}]
	}]
};

// let filteredData = deepSearch('three', data.data, {
// 	exclude: excludedData,
// });
// console.log(JSON.stringify(filteredData));
// let d2 = { "1": { "id": 7, "summary": "epic-one", "description": null, "order": 5, "externalKey": "EP-7", "color": "#ffb64f", "backlog": true, "progress": "to-do", "jiraId": null, "jiraKey": null, "jiraSelf": null, "teamId": 0, "user": null, "estimate": null, "score": null, "businessValue": null, "userStories": [], "features": [{ "id": 4, "summary": "feature-three", "description": null, "order": null, "userId": 0, "externalKey": "FE-4", "color": "#ffb64f", "progress": "to-do", "jiraId": null, "jiraKey": null, "jiraSelf": null, "teamId": 0, "user": null, "estimate": null, "score": null, "businessValue": null, "userStories": [null, { "persona": [], "id": 245, "summary": "threeuserstory", "description": "", "order": 33, "userId": 0, "externalKey": "US-33", "color": "#ffb64f", "initiativeId": "542", "backlog": true, "progress": "to-do", "tags": null, "timeBoxPlanningId": null, "businessObjectiveId": null, "businessGoal": "", "dueDate": null, "remainingTime": "0.00", "storyPoint": 0, "jiraId": null, "jiraKey": null, "jiraSelf": null, "teamId": 0, "user": null }] }] } };
// console.log(filteredData === d2);
// let cleanedData = clean(d2);
// console.log('----->',cleanedData);
// exports.deepSearch = deepSearch;
module.exports = {
	deepSearch,
	clean
}

