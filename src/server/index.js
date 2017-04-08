
/**
 * Module dependencies.
 */

var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();


app.enable('strict routing');

  
app.use(express.static('public'));

app.get('/:example', function(req, res){
  console.log('/:example');
  res.redirect('/' + req.params.example + '/');
});

app.get('/*', function(req, res){
  console.log('/*');
  res.sendFile(join(__dirname, 'public', 'index.html'));
});



app.listen(4000);
console.log('Example server listening on port 4000');
