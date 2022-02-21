const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post("/order", (req, res) => {
    //TODO use statuses
    //TODO create in database
    res.status(202)
    // database.each(`Insert into`)
    //TODO create order ID
    res.send()
})
router.get("/order", (req, res) => {
    // res.json("Status" : )
})


module.exports = router;
