/*
	Puppeteer related Requires
*/
const puppeteer = require("puppeteer");
/*
	Search Engine Config Requires
*/
const csConfig = require("./mtgCardSearchConfig.json");
/*
	Search Library Requires
*/
const misc = require("./mtgSearchMisc.js");
const helper = require("./mtgSearchHelper.js");
/*
	Misc Puppeteer Functions
*/
async function goToSpit(websiteURL,headlessMode=true){
	const browser = await puppeteer.launch({headless:headlessMode});
	const page = await browser.newPage();
	await page.goto(websiteURL);
	console.log(await page.content());

	await browser.close();
};
async function goToPrintRequests(websiteURL,headlessMode=true){
	const browser = await puppeteer.launch({headless:headlessMode});
	const page = await browser.newPage();
	await page.setRequestInterception(true);
	var proceed=false;
	await page.on("request",request=>{
		if('image'==request.resourceType()&&request.url().includes("=card")){
			imageUrl=request.url();
			proceed=true;
			console.log(request.url());
		}
		request.continue();
	});
	await page.goto(websiteURL);
	if(proceed){
		await page.goto(imageUrl);
	}
	await browser.close();
}
async function startRequestInterception(page,logDate){
	page.setRequestInterception(true);
	await page.on("request",request=>{
		//makes use of the conditional operator as a weird if statement 
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
		console.log(`${logDate?Date.now():""}: ${request.resourceType()} ${request.url()}`);
		request.continue();
	});
}

/*
	Searching Functions
*/
//parses the card description to text, forcing img tags to show their alt text
function parseCardDesc(rawDesc){
	rawDesc=rawDesc.split("<");
	rawDesc.forEach((elem,i,arr)=>{
		arr[i]=elem.split(">");
	});
	
	let finalString=``;
	for(let entry of rawDesc){
		finalString+=entry.length==1?
			entry[0]:
			helper.includesTagParm(entry[0],"alt")?
				helper.findTagParmValue(entry[0],"alt"):
				``;
		finalString+=typeof entry[1]!=='undefined'?
			entry[1]:
			``;
	}
	return finalString;
}
async function getCardIdFromCardName(cardName,headlessMode=true,closeOnFinish=true){
	const browser = await puppeteer.launch({headless:headlessMode});
	const page = await browser.newPage();
	await page.goto(csConfig.searchPageAddress);
	await page.waitForSelector(csConfig.searchBoxSelector);
	//apparently you can type into a element by using 
	await page.type(csConfig.searchBoxSelector,cardName);
	try{
		await page.waitForSelector(csConfig.cardResultsSelector,{timeout:2000});
		//cool thing about page.click If it activates a navigation event it will wait for that to resolve
		//before proceeding.
		await page.click(csConfig.cardResultsSelector,{delay:0});
		let cardId = helper.extractParmFromUrl(page.url(),csConfig.cardIdParmKey);
		if(closeOnFinish){
			await browser.close();
		}
		return cardId;
	}catch(err){
		console.log(`Card "${cardName}" was not found.`);
		if(closeOnFinish){
			await browser.close();
		}
		return null;
	}
}
async function getCardNameFromCardId(cardId,headlessMode=true,closeOnFinish=true){
	const browser = await puppeteer.launch({headless:headlessMode});
	const page = await browser.newPage();
	await page.goto(helper.cardIdToUrl(cardId));
	await page.waitForSelector(csConfig.cardNameSelector);
	let cardName = await page.evaluate((cardNameSelector)=>{
		return document.querySelector(cardNameSelector).textContent;
	},csConfig.cardNameSelector);
	if(closeOnFinish){
		await browser.close();
	}
	return cardName;
}
async function getCardInfoFromCardId(cardId,headlessMode=true,closeOnFinish=true){
	const browser = await puppeteer.launch({headless:headlessMode});
	const page = await browser.newPage();
	console.log(helper.cardIdToUrl(cardId));
	await page.goto(helper.cardIdToUrl(cardId));
	let cardInfo={};
	cardInfo.id=cardId;
	console.log(`Getting Card Name`);
	await page.waitForSelector(csConfig.cardNameSelector);
	cardInfo.name = await page.evaluate((cardNameSelector)=>{
		return document.querySelector(cardNameSelector).textContent;
	},csConfig.cardNameSelector);
	console.log(`Getting Card Image`);
	await page.waitForSelector(csConfig.cardImageSelector);
	cardInfo.imageLink = await page.evaluate((cardImageSelector)=>{
		return document.querySelector(cardImageSelector).src;
	},csConfig.cardImageSelector).then((relSrcUrl)=>helper.cardImageRelUrlToUrl(relSrcUrl));
	console.log(`Getting Card Description`);
	await page.waitForSelector(csConfig.cardDescSelector);
	cardInfo.description = await page.evaluate((cardDescSelector)=>{
		let elemArr=Array.from(document.querySelectorAll(cardDescSelector));
		elemArr.forEach((ele,i,arr)=>{
			arr[i]=ele.innerHTML;
		});
		console.log(elemArr.join(" "));
		return elemArr;
	},csConfig.cardDescSelector).then((rawCardDescArr)=>{
		return rawCardDescArr.join(" ");
	}).then((rawCardDesc)=>parseCardDesc(rawCardDesc));
	if(closeOnFinish){
		await browser.close();
	}
	return cardInfo;
}
module.exports = {
	getCardIdFromCardName:getCardIdFromCardName,
	getCardInfoFromCardId:getCardInfoFromCardId,
}