
/*
	Searching Helper Functions
*/
function cardIdToUrl(cardId){
	return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${cardId}`;
}
/*
		!!!! TODO !!!!
	Function that searches for any returns info on a tag
*/
function findHTMLTag(textToBeSearched,searchTagName){
	var tagInfo={
		startTag:{
			startCarotPos:null,
			endCarotPos:null,
		},
		endTag:{
			startCarotPos:null,
			endCarotPos:null,
		}
	}

}
//changes a card image's relative url to a url that card be used
function cardImageRelUrlToUrl(cardImageLink){
	console.log(`Changing Relative URL to URL for URL: "${cardImageLink}"`);
	return `http://gatherer.wizards.com/${cardImageLink.split("/").splice(2).join("/")}`;
}
function extractParmFromUrl(url,parmName){
	try{
		for(let para of url.split("?")[1].split("&")){
			if(para.split("=")[0]==parmName){
				return para.split("=")[1];
			}
		}
	}catch(error){
		console.log("ER: "+error);
	}
	return null;
}
function findTagParmValue(tag,parmName){
	for(var keyPval of tag.split(" ")){
		if(keyPval.split("=")[0]==parmName){
			return `${keyPval.split(`="`)[1].replace(`"`,``)}`;
		}
	}
	return null;
}
function includesTagParm(tag,parmName){
	return tag.includes(`${parmName}="`);
}
module.exports = {
	cardIdToUrl:cardIdToUrl,
	findHTMLTag:findHTMLTag,
	cardImageRelUrlToUrl:cardImageRelUrlToUrl,
	extractParmFromUrl:extractParmFromUrl,
	findTagParmValue:findTagParmValue,
	includesTagParm:includesTagParm,
}