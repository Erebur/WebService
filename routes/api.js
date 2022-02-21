var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post("/create_order", (req, res) => {
    res.status(100)
})
router.get("/get_order", (req, res) => {
    res.status(100)
})


module.exports = router;
