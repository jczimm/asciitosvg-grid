const { join } = require('path');
const { createBrowser } = require('./puppeteer-helper');

const SVGO = require('svgo');
// I don't think there will ever be a <style> in the output already, but just in case... they're optimal here
const svgo = new SVGO({ plugins: [{ inlineStyles: false }] });

const PAGE_PATH = join(__dirname, 'asciitosvg-web/index.html');
const PAGE_URL = `file://${PAGE_PATH}`;

const styles = {
  'text': {
    'font-family': 'monospace',
    'font-size': '14px'
  },
  'path': {
    'stroke': '#000',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'mitter'
  },
}
const styleBlock = `<style>${
  Object.keys(styles).map(tag => `${tag}{${
    Object.keys(styles[tag]).map(prop => `${prop}:${styles[tag][prop]}`).join(';')
  }}`).join(' ')
}</style>`;

const optimizeSvg = async (svg, { styleTag = false } = {}) => {
  let optiSvg = (await svgo.optimize(svg)).data;
  optiSvg = (await svgo.optimize(optiSvg)).data;
  
  // Move inline styles into a <style> tag
  if (styleTag) {
    // add our own <style> tag
    optiSvg = optiSvg.replace(/(<svg[^>]+>)/, `$1${styleBlock}`);
    // for each type of element we're styling, remove all corresponding inline styles
    Object.keys(styles).forEach(tag => {
      optiSvg = optiSvg.replace(
        new RegExp(`<${tag}[^>]+>`, 'g'),
        substr => substr.replace(
          new RegExp(` (${Object.keys(styles[tag]).join('|')})="?[^ "]+"?`, 'g'), ''
        )
      );
    });
  }

  // Needs work; generates erroring svg file in chrome and ignores letter positioning, contracting any space between consecutive letters  
  // // collapse consecutive <text>'s into one <text>
  // optiSvg = optiSvg.replace(/(<text[^>]+>[^<]+<\/text>){2,}/g, substr => {
  //     const texts = substr.split('</text>');
  //     const textsChars = texts.map(s => s && s.match(/<text[^>]+>(.+)$/)[1]);
  //     return `${texts[0].replace(textsChars[0], textsChars.join(''))}</text>`;
  // });

  return optiSvg;
}

const getSvgFromAscii = async (asciiInput) => {
  const browser = await createBrowser();
  const page = await browser.newPage();
  await page.goto(PAGE_URL);
  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });
  const svg = await page.evaluate(ascii => window.getSvg(ascii), asciiInput);
  await browser.close();
  return await optimizeSvg(svg);
};

const parser = require('./parser');

module.exports = { getSvg: getSvgFromAscii, parser };