const compose = require('koa-compose');

const CLIENT_ERROR = Symbol('CLIENT_ERROR');

const helpers = {
  get createBrowser() {
    if (process.env.IS_NOW) {
      const puppeteer = require('puppeteer-core');
      const chrome = require('chrome-aws-lambda');

      return async () =>
        await puppeteer.launch({
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        });
    } else {
      const puppeteer = require('puppeteer');

      return async () => await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      // I'm not using a sandbox for puppeteer because I absolutely trust the content I'm viewing--it's all local
      // (not using a sandbox for pupeteer is almost always a bad practice and may be so even here)
    }
  },
  get handleError() {
    return compose([
      async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          let errMsg;
          try {
            errMsg = err && err.message || JSON.stringify(err);
          } catch (err_) {
            ctx.STEP = 'error responder';
            errMsg = err_ && err_.message || JSON.stringify(err_);
          }
          ctx.body = `Error${ctx.STEP ? ` (from ${ctx.STEP})` : ''}: ${errMsg}${
            ctx.body ? `\n\n${ctx.body}` : ''
          }`;
          ctx.status = err.statusCode || err.status || 500;
        }
      },
      async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          if (err && err[0] === CLIENT_ERROR) {
            if (typeof ctx.getUsage === 'function') ctx.body = ctx.getUsage();
            throw { message: err[1], statusCode: 400 };
          }
          throw err;
        }
      }
    ]);
  },
  get leverageCache() {
    if (process.env.IS_NOW) {
      return async (ctx, next) => {
        await next();
        // leverage the Now CDN's caching mechanism
        ctx.set('Cache-Control', 's-maxage=31536000, maxage=0');
      };
    } else {
      const LRUCache = require('lru-cache');
      const cash = require('koa-cash');
      
      const cache = new LRUCache({ maxAge: 30000 /* global max age */ });
      return compose([
        cash({
          get (key) { return cache.get(key); },
          set (key, value) { cache.set(key, value); },
        }),
        async (ctx, next) => {
          // if there's a cached version, short-circuit; the upstream middleware (koa-cash)
          // will respond with the cached version [seeing that there's no ctx.body]
          if (await ctx.cashed()) return;
          await next();
        }
      ]);
    }
  },
  urlParamsParser(pattern) {
    return async (ctx, next) => {
      ctx.STEP = 'params parser';
      const matches = ctx.url.match(pattern);
      ctx.urlParams = matches && matches.groups || {};
      return await next();
    };
  }
};

module.exports = { ...helpers, CLIENT_ERROR };

// if (process.env.IS_NOW) {
//   const puppeteer = require('puppeteer-core');
//   const chrome = require('chrome-aws-lambda');

//   createBrowser = async () => await puppeteer.launch({
//     args: chrome.args,
//     executablePath: await chrome.executablePath,
//     headless: chrome.headless,
//   });

//   cacheMiddleware = async (ctx, next) => {
//     await next();
//     // leverage the Now CDN's caching mechanism
//     ctx.set('Cache-Control', 's-maxage=31536000, maxage=0');
//   };
// } else {
//   const puppeteer = require('puppeteer');
//   const LRUCache = require('lru-cache');
//   const cash = require('koa-cash');
//   const compose = require('koa-compose');

//   createBrowser = async () => await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//   // I'm not using a sandbox for puppeteer because I absolutely trust the content I'm viewing--it's all local
//   // (not using a sandbox for pupeteer is almost always a bad practice and may be so even here)

//   const cache = new LRUCache({
//     maxAge: 30000 // global max age
//   });

//   cacheMiddleware = compose([
//     cash({
//       get (key) { return cache.get(key); },
//       set (key, value) { cache.set(key, value); },
//     }),
//     async (ctx, next) => {
//       // if there's a cached version, short-circuit; the upstream middleware (koa-cash)
//       // will respond with the cached version [seeing that there's no ctx.body]
//       if (await ctx.cashed()) return;
//       await next();
//     }
//   ]);
// }
