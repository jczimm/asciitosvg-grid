const puppeteer = require('puppeteer');
const { join } = require('path');

const PAGE_URL = `file:${join(__dirname, 'asciitosvg-web/index.html')}`;

const getSvg = async (asciiInput) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // I'm not using a sandbox for puppeteer because I absolutely trust the content I'm viewing--it's all local
    // (not using a sandbox for pupeteer is almost always a bad practice and may be even here)

    const page = await browser.newPage();
    await page.goto(PAGE_URL);
    const svg = await page.evaluate(async ascii => getSvg(ascii), asciiInput);
    await browser.close();
    
    return svg;
};

module.exports = { getSvg };