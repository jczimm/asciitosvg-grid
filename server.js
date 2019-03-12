const Koa = require('koa');
const LRUCache = require('lru-cache');
const { parser, getSvg } = require('.');

const app = new Koa();

const respond = (ctx, status, body) => {
  ctx.body = body;
  ctx.status = status;
};
const USAGE = 'TODO';
const respondUsage = (ctx, err, status = err ? 400 : 200) => respond(ctx, status, `Error: ${err}

Usage: ${USAGE}`);

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
  if (await ctx.cashed()) return;
  await next();
});

// parse
app.use(async (ctx, next) => {
  if (ctx.request.url === '/') return respondUsage(ctx);

  const urlMatches = ctx.request.url.match(/^\/([^/]+)\/([\s\S]+)$/);
  if (!urlMatches) return respondUsage(ctx, 'Bad path');

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
    return respondUsage(ctx, 'Invalid data type');
  }
  await next();
});

// render svg
app.use(async (ctx, next) => {
  try {
    ctx.svgOutput = await getSvg(ctx.asciiInput || 'no ascii text provided');
    await next();
  } catch (err) {
    return respondUsage(ctx, `from SVG Render: ${err.message}`);
  }
});

// respond svg
app.use((ctx) => {
  ctx.type = 'image/svg+xml';
  ctx.body = ctx.svgOutput;
});

if (process.env.NODE_ENV === 'development') {
  app.listen(3000);
  console.log('Listening...');
}

module.exports = app.callback();
