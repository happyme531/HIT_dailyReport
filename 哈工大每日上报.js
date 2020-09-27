//@ts-check
var selenium = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/firefox');
const { waitForDebugger } = require('inspector');
var fs = require('fs');
const { exit } = require('process');


const username = "";    //输入你的用户名
const password = "";    //输入你的密码

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs))

/**
 * @param {string | number | Buffer | import("url").URL} path
 * @param {import("selenium-webdriver").WebDriver} driver
 */
async function takeScreenshotAndSave(path,driver){
    let pngbase64 = await driver.takeScreenshot();
    let bitmap1 = Buffer.from(pngbase64, 'base64');
    fs.writeFileSync(path,bitmap1);
};
var driver;

async function main(){
    driver =  await new selenium.Builder().forBrowser('firefox').setFirefoxOptions(new Options().headless()).build();
    await driver.manage().window().setRect({ width: 600, height: 2000 });
    console.log("浏览器启动成功");
    await driver.get("https://xg.hit.edu.cn/zhxy-xgzs/xg_mobile/xsHome");
    let title = await driver.getTitle();
    console.log("当前页面:%s",title);
    console.log("页面加载完成");
    let usernameInputBox = await driver.findElement(selenium.By.id("username"));
    await usernameInputBox.click();
    await usernameInputBox.sendKeys(username);
    let passwordInputBox = await driver.findElement(selenium.By.id("password"));
    await passwordInputBox.click();
    await passwordInputBox.sendKeys(password);
    let loginBtn = await driver.findElement(selenium.By.className("auth_login_btn"));
    await loginBtn.click();
    title = await driver.getTitle();
    console.log("当前页面:%s",title);
    console.log("登录完成");
    
    //进入每日上报
    await sleep(5000);
    let dailyUploadPageBtn = await driver.wait(selenium.until.elementsLocated(selenium.By.id("mrsb")),5000);
    await dailyUploadPageBtn[0].click();
    title = await driver.getTitle();
    console.log("当前页面:%s",title);
    
    await sleep(5000);
    await driver.executeScript("add()");
    //等待加载完成
    let conFirmCheckBox = await driver.wait(selenium.until.elementsLocated(selenium.By.xpath("//input[@type='checkbox']")),5000);
    //这个页面中的其它输入框和上一次上报的信息是一样的，所以不需要额外的操作.(不确定！！)
    await sleep(15000);
    await conFirmCheckBox[0].click();
    //takeScreenshotAndSave("/home/user/out.png",driver);
    await driver.wait(selenium.until.elementsLocated(selenium.By.className("right_btn")),5000);
    await sleep(5000);
    await driver.executeScript("save()");
    console.log("每日上报完成");
    
    /* 
    //进入体温上报
    await driver.get("https://xg.hit.edu.cn/zhxy-xgzs/xg_mobile/xsHome");
    await driver.executeScript("jszc()");
    title = await driver.getTitle();
    console.log("当前页面:%s",title);
    
    await driver.wait(selenium.until.elementsLocated(selenium.By.className("liucheng")),20000);
    await sleep(10000);
    await driver.executeScript("add()");    //添加上报
    await sleep(10000);
    takeScreenshotAndSave("/home/user/out2.png",driver);
    await driver.wait(selenium.until.elementsLocated(selenium.By.id("grxx")),20000);
    await sleep(1000);
    await driver.executeScript("tx(1)");    //启动填写模式
    
    await driver.wait(selenium.until.elementsLocated(selenium.By.className("czbtn1")),30000);
    await sleep(1000);
    let randomTemp = (Math.random()*(36.7-35.6) + 35.6).toFixed(1);
    await driver.executeScript("document.querySelector('#tw1').setAttribute('data-action','"+randomTemp+"')"); //填写温度
    console.log("填写了温度1:%s",randomTemp.toString());
   
    let cancelBtn = await driver.findElement(selenium.By.linkText("取消"));
    await sleep(1000);
    await cancelBtn.click();
    await sleep(1000);
    await driver.executeScript("save(1)");  //保存体温
    await sleep(10000); //！！
    takeScreenshotAndSave("/home/user/out2.png",driver);
    await driver.executeScript("tx(2)");    //启动填写模式
    await driver.wait(selenium.until.elementsLocated(selenium.By.id("tw2")),5000);
    await sleep(1000);
    randomTemp = (Math.random()*(36.7-35.6) + 35.6).toFixed(1);
    await driver.executeScript("document.querySelector('#tw2').setAttribute('data-action','"+randomTemp+"')"); //填写温度
    console.log("填写了温度2:%s",randomTemp.toString());
    cancelBtn = await driver.findElement(selenium.By.linkText("取消"));
    await sleep(1000);
    await cancelBtn.click();
    await sleep(1000);
    await driver.executeScript("save(2)");
    await sleep(1000);
    //await driver.executeScript("fanhui()"); //返回 */
    console.log("全部完成"); 
    //await driver.executeScript
    // let tempUploadBtn =  await driver.findElement(selenium.By.className("mrsb ")); //有个空格
    // await tempUploadBtn.click();
};

(async function run() {
    try {
        await main();
    }finally {
        await driver.quit();
        console.log("已退出");
    }
})();

