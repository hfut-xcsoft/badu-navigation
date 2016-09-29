const Koa = require('koa');
const routes = require('./routes');
const configs = require('./configs');
const app = new Koa();

// response
app.use(routes);

app.listen(configs.port, () => {
  console.log('App listening on %d', configs.port);
});