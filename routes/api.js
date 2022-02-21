const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// const con = mysql.createConnection({
//     host: "devel1",
//     user: "Carlos",
//     password: "carlos"
// });

// con.connect(function (err) {
//     if (err) console.log(err)
//     console.log("Connected!")
// });

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
});

router.get("/order", (req, res) => {
    // res.json("Status" : )
});

module.exports = router;
