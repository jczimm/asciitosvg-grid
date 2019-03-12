const Koa = require('koa');
const compose = require('koa-compose');
const { parser, getSvg, helpers: {
  leverageCache,
  handleError,
  CLIENT_ERROR,
  urlParamsParser,
} } = require('..');

const app = new Koa();

app.use(compose([
  async (ctx, next) => {
    ctx.getUsage = () => 'Usage: TODO';
    await next();
  },
  handleError,
  leverageCache,
  // respond
  async (ctx, next) => {
    ctx.body = await next();
    
    ctx.STEP = 'responder';
    ctx.type = 'image/svg+xml';
    ctx.status = 200;
  },
  async (ctx, next) => {
    const asciiInput = await next();

    ctx.STEP = 'renderer';
    if (!asciiInput) throw [CLIENT_ERROR, 'no ascii text provided'];
    return await getSvg(asciiInput);
  },
  urlParamsParser(/^\/(render\/)?(?<type>[^/]+)\/(?<data>[\s\S]+)$/i),
  async (ctx) => {
    ctx.STEP = 'decoder';

    const dataType = ctx.urlParams.type;
    const data = decodeURIComponent(ctx.urlParams.data);
    const escapedAscii = parser.parseUriEscapedAscii(data);

    if (dataType === 'raw') return escapedAscii;
    else if (dataType === 'base64') return parser.util.atob(escapedAscii);
    else if (dataType === 'unicode') return parser.util.miniUni.decode(escapedAscii);
    else throw [CLIENT_ERROR, 'Invalid data type'];
  }
]));

if (process.env.IS_NOW) {
  module.exports = app.callback();
} else {
  app.listen(3000);
  console.log('Listening...');
}
