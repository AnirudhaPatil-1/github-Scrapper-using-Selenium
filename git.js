require("chromedriver");
const fs = require("fs");

let wd = require("selenium-webdriver");
let browser = new wd.Builder().forBrowser('chrome').build();


let finalData = [];
let totalProjects = 0;
let projectCovered = 0;

async function getProjectUrls(url, i){
    let browser = new wd.Builder().forBrowser('chrome').build();
    await browser.get(url);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".text-bold.wb-break-word")));
    let projectBoxes = await browser.findElements(wd.By.css(".text-bold.wb-break-word"));
    totalProjects += ((projectBoxes.length > 2) ? 2 : projectsBoxes.length)
    finalData[i]["projects"] = [];
    for(let j in projectBoxes){
        if(j == 2){
            break;
        }
        finalData[i].projects.push({projectUrl : await projectBoxes[j].getAttribute("href")});
    }
    let projects = finalData[i].projects;
        for(let j in projects){
            getIssues(projects[j].projectUrl, i, j)
        }
        //check
        // fs.writeFileSync("finalData.json", JSON.stringify(finalData));
    browser.close();
}

async function getIssues(url, i, j){
    let browser = new wd.Builder().forBrowser('chrome').build();
    await browser.get(`${url}/issues`);
    finalData[i].projects[j]["issues"] = [];
    let issuesBoxes = await browser.findElements(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")); 
    let currUrl = await browser.getCurrentUrl();
    if(currUrl == (url+"/issues") && issuesBoxes.length != 0){
        for(let k in issuesBoxes){
            if(k == 8){
                break;
            }
            let heading  = await issuesBoxes[k].getAttribute("innerText");
            let url = await issuesBoxes[k].getAttribute("href"); 
            // let heading = await issuesBoxes[k].getAttribute("innerText");
            // let url = await issuesBoxes[k].getAttribute("href");
            finalData[i].projects[j].issues.push({"heading" : heading, "url" : url});
        }
    }
    projectCovered +=1;
    // await browser.wait(wd.until.elementsLocated(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")));
    if(projectCovered == totalProjects ){
        fs.writeFileSync("Output.json", JSON.stringify(finalData));
    }
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
    // fs.writeFileSync("finalData.json", JSON.stringify(finalData));
    browser.close();

}
main();