
const router = require('koa-router')();

router.get('/', (ctx, next) => {
  ctx.body = 'hello';
});
router.get('/haha', (ctx, next) => {
  ctx.body = 'haha';
});

module.exports = router.routes();