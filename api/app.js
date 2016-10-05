require('babel-register')();
const Koa = require('koa');
const convert = require('koa-convert');
const bodyparser = require('koa-bodyparser');
const middlewares = require('./middlewares');
const controllers = require('./controllers');
const configs = require('./configs');
const app = new Koa();

app.use(middlewares.errorHandling);
app.use(middlewares.verify);
app.use(convert(bodyparser()));
app.use(controllers);

app.on('error', function(err){
  console.log(err.stack);
});

module.exports = app.listen(configs.port, () => {
  console.log('App listening on %d', configs.port);
});

