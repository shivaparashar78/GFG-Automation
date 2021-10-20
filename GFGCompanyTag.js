const minimist = require("minimist");
const puppeteer  = require("puppeteer");
const fs = require("fs");
const pdf = require("pdf-lib");  
const args = minimist(process.argv);
//node GFGCompanyTag.js --url=https://www.google.co.in --config=config.json

let configJson = fs.readFileSync(args.config , "utf-8");
let config = JSON.parse(configJson);

(async function(){
   let browser =  await puppeteer.launch({
       headless : false ,
        defaultViewport :null ,
        args : ["--start-maximized"]
    });
    let pages = await  browser.pages();
    let page = pages[0];
    await page.goto(args.url);
    await page.waitForTimeout(2000);
    await page.waitForSelector("input[name='q']");
    await page.type("input[name='q']" , "geeksforgeeks" , {delay:100});

    await page.keyboard.press('Enter');

        
    await page.waitForSelector("div.BYM4Nd h3.LC20lb.DKV0Md");
    await page.hover("div.BYM4Nd h3.LC20lb.DKV0Md");
   
    await page.click("div.BYM4Nd h3.LC20lb.DKV0Md");

    await page.waitForTimeout(3000);

    await page.waitForSelector("a.header-main__signup.login-modal-btn");
    await page.click("a.header-main__signup.login-modal-btn");

    await page.waitForTimeout(2000);

    await page.type("input#luser" , config.username , {delay: 100});
    await page.waitForSelector("input#luser");

    await page.waitForTimeout(2000);

    await page.waitForSelector("input#luser");
    await page.type("input#password" , config.password , {delay: 100});

    await page.waitForTimeout(2000);

    await page.waitForSelector("input[type='checkbox']");
    await page.click("input[type='checkbox']");

    await page.waitForTimeout(2000);

    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000);

    await page.waitForSelector("i.gfg-icon gfg-icon_arrow-down.gfg-icon_header");
    await page.hover("i.gfg-icon.gfg-icon_arrow-down.gfg-icon_header");
    await page.click("i.gfg-icon.gfg-icon_arrow-down.gfg-icon_header");

    await page.waitForTimeout(3000);
    
    await page.waitForSelector("i.gfg-icon.gfg-icon_arrow-right");
    await page.hover("i.gfg-icon.gfg-icon_arrow-right");
    await page.click("i.gfg-icon.gfg-icon_arrow-right");
    
    await page.waitForTimeout(3000);

    await page.waitForSelector('a[href="https://practice.geeksforgeeks.org/company-tags"]');
    await page.hover('a[href="https://practice.geeksforgeeks.org/company-tags"]');
    await page.click('a[href="https://practice.geeksforgeeks.org/company-tags"]');

    await page.waitForTimeout(3000);
    await page.waitForSelector("td.text-center a b");
    
    let TotalCompanies = await page.$$eval("td.text-center a b" , function(CName){
    
        let companyName = [];
        for(let  i = 0 ; i < CName.length; i++){
            let name =  CName[i].textContent; //ex:/company/amazon
            companyName.push(name);
        }
        return companyName;
    });
   // console.log(TotalCompanies.length);

    for(let i = 0 ; i < TotalCompanies.length ; i++){
        let url = "https://practice.geeksforgeeks.org/company/" + TotalCompanies[i] + "/";
        let OpenNewTabForACompany = await browser.newPage();
        await OpenNewTabForACompany.bringToFront();
        await OpenNewTabForACompany.goto(url);

        await OpenNewTabForACompany.waitForTimeout(3000);

        await autoScroll(OpenNewTabForACompany);
        
        await OpenNewTabForACompany.waitForTimeout(3000);

        
        await fetchProblemsName(OpenNewTabForACompany);

        await OpenNewTabForACompany.close();

        page.waitForTimeout(3000);
    }

})();
    
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        });
    });
}


async function fetchProblemsName(OpenNewTabForACompany){
    await OpenNewTabForACompany.waitForSelector("div.col-sm-6.col-md-6.col-lg-6.col-xs-12.item  div.panel-body > span");
    let ProblemName = await OpenNewTabForACompany.$$eval("div.col-sm-6.col-md-6.col-lg-6.col-xs-12.item  div.panel-body > span" ,
    function(span){
        let Problemspan = [];
        for(let i = 0 ; i < span.length ; i++){
            let name = span[i].textContent;
            Problemspan.push(name);
        }
        return Problemspan;
    })
    for(let i = 0 ; i < ProblemName.length ; i++){
       console.log(ProblemName[i]);
    }

}




//     for(let i = 0 ; i < TotalTags.length ; i++){
//         //"https://practice.geeksforgeeks.org/company/" + companyName + "/";

//         let url = "https://practice.geeksforgeeks.org" + TotalTags[i];
//         let OpenNewTabForACompany = await browser.newPage();
//         await OpenNewTabForACompany.bringToFront();
//         await OpenNewTabForACompany.goto(url);

//         await OpenNewTabForACompany.waitFor(5000);
      
//         await OpenNewTabForACompany.waitForSelector("div.col-sm-6.col-md-6.col-lg-6.col-xs-12.item  div.panel-body > span");
        
//         await autoScroll(OpenNewTabForACompany);

//         await fetchProblemName(OpenNewTabForACompany);
      
//         createAndModifyPdf(OpenNewTabForACompany , url);

//         await OpenNewTabForACompany.close();
//         await page.waitFor(3000);
//     }
    
// })();






// async function createAndModifyPdf(OpenNewTabForACompany , url){

//     // let bytesOfPDFTemplate = fs.readFileSync("Template.pdf");
//     // let pdfdocKaPromise = pdf.PDFDocument.load(bytesOfPDFTemplate);
//     // pdfdocKaPromise.then(function(pdfdoc){
//     //     let page = pdfdoc.getPage(0);

//     let bytesOfPDFTemplate = fs.readFileSync("Template.pdf");
//     let pdfdoc = await pdf.PDFDocument.load(bytesOfPDFTemplate);
//     let page = pdfdoc.getPage(0);

//     page.drawText(url);

//     let finalPdf = await pdfdoc.save();
//     fs.writeFileSync("Company.pdf" , finalPdf);
// };