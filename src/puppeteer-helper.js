let createBrowser;

if (process.env.IS_NOW) {
  const puppeteer = require('puppeteer-core');
  const chrome = require('chrome-aws-lambda');
  createBrowser = async () => await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });
} else {
  const puppeteer = require('puppeteer');
  createBrowser = async () => await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  // I'm not using a sandbox for puppeteer because I absolutely trust the content I'm viewing--it's all local
  // (not using a sandbox for pupeteer is almost always a bad practice and may be so even here)
}

module.exports = { createBrowser };