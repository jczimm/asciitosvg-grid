const Koa = require('koa');
const { parser, getSvg } = require('.');

const app = new Koa();

const respond = (ctx, status, body) => {
  ctx.body = body;
  ctx.status = status;
};
const USAGE = 'TODO';
const respondUsage = (ctx, err, status = err ? 400 : 200) =>
  respond(ctx, status, (err ? `Error: ${err}\n\n` : '') + `Usage: ${USAGE}`);

// now's cdn does the caching automatically
if (process.env.IS_NOW) {
  app.use(async (ctx, next) => {
    await next();
    ctx.set('Cache-Control', 's-maxage=31536000, maxage=0');
  });
} else {
  const LRUCache = require('lru-cache');
  const cache = new LRUCache({
    maxAge: 30000 // global max age
  });

  app.use(require('koa-cash')({
    get (key, maxAge) {
      return cache.get(key);
    },
    set (key, value) {
      cache.set(key, value);
    },
  }));

  // try cache
  app.use(async (ctx, next) => {
    if (await ctx.cashed()) return; // koa-cash will respond with the cached version
    await next();
  });
}

// respond
app.use(async (ctx, next) => {
  await next();
  if (ctx.errorMsg) {
    respondUsage(ctx, ctx.errorMsg)
  } else if (ctx.svgOutput) {
    ctx.type = 'image/svg+xml';
    ctx.body = ctx.svgOutput;
  } else {
    respondUsage(ctx);
  }
});

// render svg
app.use(async (ctx, next) => {
  await next();
  if (ctx.errorMsg) return;
  try {
    ctx.svgOutput = await getSvg(ctx.asciiInput || 'no ascii text provided');
  } catch (err) {
    ctx.errorMsg = `from SVG Render: ${err.message}`;
  }
});

// parse ascii input
app.use(async (ctx) => {
  if (ctx.request.url === '/') return;

  const urlMatches = ctx.request.url.match(/^\/([^/]+)\/([\s\S]+)$/);
  if (!urlMatches) return ctx.errorMsg = 'Bad path';

  const [_, dataType, escapedData] = urlMatches;
  const data = decodeURIComponent(escapedData);

  const escapedAscii = parser.parseUriEscapedAscii(data);

  if (dataType === 'raw') {
    ctx.asciiInput = escapedAscii;
  } else if (dataType === 'base64') {
    ctx.asciiInput = parser.util.atob(escapedAscii);
  } else if (dataType === 'unicode') {
    ctx.asciiInput = parser.util.miniUni.decode(escapedAscii);
  } else {
    ctx.errorMsg = 'Invalid data type';
  }
});

if (process.env.IS_NOW) {
  module.exports = app.callback();
} else {
  app.listen(3000);
  console.log('Listening...');
}


