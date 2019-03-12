let puppeteer, chrome;
if (process.env.IS_NOW) {
  puppeteer = require('puppeteer-core');
  chrome = require('chrome-aws-lambda');
} else {
  puppeteer = require('puppeteer');
}

function createBrowser() {
  if (process.env.IS_NOW) {
    return chrome.executablePath.then((executablePath) =>
      puppeteer.launch({
        args: chrome.args,
        executablePath,
        headless: chrome.headless,
      })
    );
  } else {
    return puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    // I'm not using a sandbox for puppeteer because I absolutely trust the content I'm viewing--it's all local
    // (not using a sandbox for pupeteer is almost always a bad practice and may be so even here)
  }
}

module.exports = { createBrowser };