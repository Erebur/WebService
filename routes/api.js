const Adresse = require("./adresse");

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const con = mysql.createConnection({
    host: "devel1",
    user: "admin",
    password: "the27",
    database: "Carlos"
});

con.connect(function (err) {
    if (err) console.log(err)
    else console.log("Connected!")
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post("/order", (req, res) => {
    let delivery_adress_json = "lieferAdresse";
    let billing_adress_json = "rechnungsAdresse";

    const delivery_adress = new Adresse(req.body[delivery_adress_json]["vorname"], req.body[delivery_adress_json]["nachname"], req.body[delivery_adress_json]["strasse"], req.body[delivery_adress_json]["nr"], req.body[delivery_adress_json]["plz"], req.body[delivery_adress_json]["ort"]);
    const billing_adress = new Adresse(req.body[billing_adress_json]["vorname"], req.body[billing_adress_json]["nachname"], req.body[billing_adress_json]["strasse"], req.body[billing_adress_json]["nr"], req.body[billing_adress_json]["plz"], req.body[billing_adress_json]["ort"]);


    console.log(req.body.lieferAdresse.vorname)

    // con.query("Insert into Auftrag () ")

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
