/*
	Misc Functions
*/
function trueSize(arr){
	let x=0;
	for(let elem of arr){
		//console.log(`Elem: "${elem}" is of type ${typeof elem}`);
		typeof elem=='object'?x+=trueSize(elem):x++;
	}
	return x;
	/*
	Confirmation Unit Tests
		let test = ["a","b","c"];
		let test1 = [["a","b","c"],["d","e"]];
		console.log(trueSize(test));
		console.log(trueSize(test1));
	*/
}
function trueArray(arr){
	let trueArr=[];
	for(let elem of arr){
		//console.log(`Elem: "${elem}" is of type ${typeof elem}`);
		Array.prototype.push.apply(trueArr,typeof elem=='object'?trueArray(elem):[elem]);
	}	
	return trueArr;
	/*
	Confirmation Unit Tests
		let test = ["a","b","c"];
		let test1 = [["a","b","c"],["de","fg"],"hi"];
		console.log(trueArray(test));
		console.log(trueArray(test1));
	*/
}
module.exports = {
	trueSize:trueSize,
	trueArray:trueArray,
}