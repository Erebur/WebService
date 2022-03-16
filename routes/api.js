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



router.post("/order", (req, res) => {
    let delivery_adress_json = "lieferAdresse";
    let billing_adress_json = "rechnungsAdresse";


    const delivery_adress = new Adresse(req.body[delivery_adress_json]["vorname"], req.body[delivery_adress_json]["nachname"], req.body[delivery_adress_json]["strasse"], req.body[delivery_adress_json]["nr"], req.body[delivery_adress_json]["plz"], req.body[delivery_adress_json]["ort"]);
    const billing_adress = new Adresse(req.body[billing_adress_json]["vorname"], req.body[billing_adress_json]["nachname"], req.body[billing_adress_json]["strasse"], req.body[billing_adress_json]["nr"], req.body[billing_adress_json]["plz"], req.body[billing_adress_json]["ort"]);

    con.query(`Select adresse_index(?,?,?,?,?,?) ;`, [delivery_adress.vorname, delivery_adress.nachname, delivery_adress.strasse, delivery_adress.nr, delivery_adress.plz, delivery_adress.ort], (err, result) => {
        if (err) console.log(err);
        delivery_adress.id = getIdFromRow(result);
        console.log(delivery_adress.id);
    })
    con.query(`Select adresse_index(?,?,?,?,?,?) ;`, [billing_adress.vorname, billing_adress.nachname, billing_adress.strasse, billing_adress.nr, billing_adress.plz, billing_adress.ort], (err, result) => {
        if (err) console.log(err);

        billing_adress.id = getIdFromRow(result);
        console.log(billing_adress.id);
    })

    try {
        con.query(`Select p.id from Produkt p where p.name = ?;`, [req.body["bestellung"]["type"]], (err, result) => {
            if (err) console.log(err);
            console.log(getIdFromRow(result))
        })
    }catch (e) {
        //TODO abort if error
        // console.error(e)
    }


    //TODO create Order


    console.log(req.body["lieferAdresse"].nachname)

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

function getIdFromRow(result) {
    // Jesus Christ our Savior and Lord please save us from Javascript
    // and cursed AF code
    try {
        return Object.values(JSON.parse(JSON.stringify(result))[0]).toString();
    } catch (e) {
        // console.log(e)
    }
}

module.exports = router;
