

const Adresse = require("../objects/adresse");

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const con = mysql.createConnection({
    //TODO extract this
    host: "devel1", user: "root", password: "the27", database: "Carlos"
});

con.connect(function (err) {
    if (err) console.log(err)
    else console.log("Connected!")
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


function send(res) {
    res.send()
}

router.post("/order", (req, res) => {

    let delivery_adress_json = "lieferAdresse";
    let billing_adress_json = "rechnungsAdresse";

    let delivery_adress = new Adresse(req.body[delivery_adress_json]["vorname"], req.body[delivery_adress_json]["nachname"], req.body[delivery_adress_json]["strasse"], req.body[delivery_adress_json]["nr"], req.body[delivery_adress_json]["plz"], req.body[delivery_adress_json]["ort"]);
    let billing_adress = new Adresse(req.body[billing_adress_json]["vorname"], req.body[billing_adress_json]["nachname"], req.body[billing_adress_json]["strasse"], req.body[billing_adress_json]["nr"], req.body[billing_adress_json]["plz"], req.body[billing_adress_json]["ort"]);

    con.query('select create_order(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [delivery_adress.vorname, delivery_adress.nachname, delivery_adress.strasse, delivery_adress.nr, delivery_adress.plz, delivery_adress.ort,
            billing_adress.vorname, billing_adress.nachname, billing_adress.strasse, billing_adress.nr, billing_adress.plz, billing_adress.ort,
            req.body["bestellung"]["type"], req.body["bestellung"]["anzahl"]],
        (err, result) => {
            if (err) {
                res.status(400)
            } else {
                res.status(202)
            }
            send(res);
        })
});

router.get("/order", (req, res) => {
    // res.json("Status" : )
});

function getIdFromRow(result) {
    // Jesus Christ our Savior and Lord please save us from Javascript
    // and cursed AF code
    return Object.values(JSON.parse(JSON.stringify(result))[0]).toString();
}

module.exports = router;
