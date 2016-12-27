var express = require('express');
var router = express.Router();
var fs = require('fs');

var cakes;

fs.readFile('cakes.json', 'utf8', (err, data) => {
  if (err) throw err;
  cakes = JSON.parse(data);
  console.log(cakes);
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/info', function (req, res, next){
  res.render ('info');
})

router.get('/cakes/:id', function(req, res, next) {
  res.render('cake', {
      id :cakes['cakes'][req.params.id]['id'],
      name: cakes['cakes'][req.params.id]['name'],
      color: cakes['cakes'][req.params.id]['color'],
      rating: cakes['cakes'][req.params.id]['rating'],
      weight: cakes['cakes'][req.params.id]['weight'],
       img: cakes['cakes'][req.params.id]['img']
  });
});


router.get ('/cakes', function (req, res, next) {
  res.render('cakes', {cakes: cakes['cakes']} );
})

module.exports = router;
