let puppeteer = require("puppeteer");
let { answers } = require("./codes");
(async function fn() {
  browserInstance = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  allTabs = await browserInstance.pages();
  cTab = allTabs[0];
  await cTab.goto("https://www.hackerrank.com/auth/login");
  await cTab.type("input[name='username']", "moxap82958@kindbest.com");
  await cTab.type("input[name='password']", "hameed");
  await cTab.click("button[data-analytics='LoginPassword']");
  await waitAndClick(
    ".ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link.ui-btn-styled"
  );
  
  await waitAndClick("a[data-attr1='warmup']");

  await cTab.waitForSelector(".challengecard-title",{visible:true});
  let currentPageUrl = await cTab.url();
  console.log(currentPageUrl);
  for(let i = 0; i < answers.length; i++){
      let obj = answers[i];
      await questionSolver(obj.qName, obj.soln,currentPageUrl);
  }
  


})();



async function waitAndClick(selector){
    try{
        await cTab.waitForSelector(selector,{visible:true});
        await cTab.click(selector);
    }catch(err){
        return new Error(err);
    }
}
async function questionSolver(qName, code, mainPageLink) {
    await cTab.goto(mainPageLink);
    await cTab.evaluate(consoleFn, ".challengecard-title", qName);
    // next page element wait that is not pesent on the previous page
    await cTab.waitForSelector("div[data-attr2='Submissions']", { visible: true });
    await waitAndClick(".checkbox-input");
    await cTab.waitForSelector(".custominput", { visible: true });
    await cTab.type(".custominput", code);
    await cTab.keyboard.down("Control");
    await cTab.keyboard.press("a");
    await cTab.keyboard.press("x");
    await cTab.click(".monaco-editor.no-user-select.vs");
    await cTab.keyboard.press("a");
    await cTab.keyboard.press("v");
    await cTab.click(".hr-monaco-submit");
    await cTab.keyboard.up("Control");
}
function consoleFn(selector, qName) {
    let qNamesElem = document.querySelectorAll(selector);
    for (let i = 0; i < qNamesElem.length; i++) {
        let cName = qNamesElem[i].innerText.split("\n")[0];
        if (cName == qName) {
            console.log(cName);
            return qNamesElem[i].click();

        }
    }
}