// function (keyword,artifacts)
// flatten artifacts
// filter flattened data
// revert to array

const flatten = require("./flatten");

function deepSearch(keyword, artifacts, options={excluded:[]}) {
  let filteredKeyValue = {};
  let expandedResult = [];
  const flatObject = flatten(artifacts);
console.log(flatObject)
  let flatKeys = Object.keys(flatObject);
  let keys = flatKeys.map((key) => {
	  const splitKey = key.split(".");
	  const last = splitKey.pop();
	  const secondLast = splitKey.pop();
	  if(isNaN(Number(secondLast))){ 
		  return `${secondLast}.${last}`
	  }else{
		  return last;
	  }
	});

  keys = [...new Set(keys)];


  let filteredResults = Object.keys(flatObject).filter((k) => {
    const shouldExclude = options.excluded.indexOf(k.split(".").pop())>-1;
    if(shouldExclude){
       return false;
    }
    if (!flatObject[k]) {
      return false;
    }
    if (flatObject[k].toString().includes(keyword)) {
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
  expandedResult = expandedResult.map(
    (f) => {
		if(typeof flatObject[f] !== 'undefined'){
			filteredKeyValue[f] = flatObject[f]}
		}
  );


  return flatten.unflatten(filteredKeyValue);
}


exports.deepSearch = deepSearch;
