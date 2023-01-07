require("chromedriver");
const fs = require("fs");

let wd = require("selenium-webdriver");
let browser = new wd.Builder().forBrowser('chrome').build();


let finalData = [];
async function getProjectUrls(url, i){
    let browser = new wd.Builder().forBrowser('chrome').build();
    await browser.get(url);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".text-bold.wb-break-word")));
    let projectBoxes = await browser.findElements(wd.By.css(".text-bold.wb-break-word"));{}
    finalData[i]["projects"] = [];
    for(let j in projectBoxes){
        if(j < 2){
            finalData[i]["projects"].push({projectUrl : (await projectBoxes[j].getAttribute("href"))});
        }
    }
    let projects = finalData[i].projects;
        for(let j in projects){
            getIssues(projects[j].projectUrl, i, j)
        }
    browser.close();
}

async function getIssues(url, i, j){
    let browser = new wd.Builder().forBrowser('chrome').build();
    await browser.get(url);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".UnderlineNav-item.no-wrap.js-responsive-underlinenav-item.js-selected-navigation-item")));
    let finalData[i][projects][j]["projectIssues"] = [];

    

    browser.close();
}

async function main(){
    await browser.get("https://github.com/topics");
    //safety condition -> .wait elementLocated
    await browser.wait(wd.until.elementLocated(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center")));
    let topicBoxes = await browser.findElements(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center"));
    // console.log(topicBoxes.length);
    // let topicUrls = [];
    for(let topicBox of topicBoxes){
        // topicUrls.push(await topicBox.getAttribute("href"));
        finalData.push({topicUrl :await topicBox.getAttribute("href")});
    }
    // console.log(topicUrls);
    for(let i in finalData){
        getProjectUrls(finalData[i].topicUrl, i);
    }
    
    // console.log(finalData);
    fs.writeFileSync("finalData.json", JSON.stringify(finalData));
    browser.close();

}
main();