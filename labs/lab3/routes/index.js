var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get ('/cakes', function (req, res, next) {
    res.render ('objects', {objects : res.json (object)});
})

module.exports = router;
