const Express = require('express');
const request = require('request');
const path = require('path');
const app = Express();


app.set('views', './views');
app.set('view engine', 'pug');
app.locals.pretty = true;
app.use('/assets', Express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res, next) => {
  request('http://localhost:4000', (err, response, body) => {
    if (err) {
      return res.send(err);
    }
    res.render('index.pug', {
      categories: JSON.parse(body)
    })
  })
});

app.listen(3000);
console.log('APP started on  port 3000');
