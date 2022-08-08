// function (keyword,artifacts)
// flatten artifacts
// filter flattened data
// revert to array

const flatten = require("./flatten");

/**
 * It performs searching on input artifacts
 * @param {*} keyword - search string
 * @param {*} artifacts - nested array or object
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
    const splitKey = key.split(".");
    const last = splitKey.pop();
    const secondLast = splitKey.pop();
    if (isNaN(Number(secondLast))) {
      return `${secondLast}.${last}`;
    } else {
      return last;
    }
  });

  // Remove duplicate keys
  keys = [...new Set(keys)];

  // Perform searching on nested array only on include keys.
  let filteredResults = Object.keys(flatObject).filter((k) => {
    // Searching by key
    if (searchByKey && searchByKey.trim().length) {
      if (
        flatObject[searchByKey]
          .toString()
          .toLowerCase()
          .includes(keyword.toLowerCase())
      ) {
        return true;
      }
    } else {
      // Searching on all the keys except keys that are passed in excludeArray.
      const shouldExclude = options.exclude.indexOf(k.split(".").pop()) > -1;
      if (shouldExclude) {
        return false;
      }
      if (!flatObject[k]) {
        return false;
      }
      if (
        flatObject[k].toString().toLowerCase().includes(keyword.toLowerCase())
      ) {
        return true;
      }
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

exports.deepSearch = deepSearch;
