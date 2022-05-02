const con = require("../objects/DBconnection");

const Adresse = require("../objects/adresse");

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post("/order", (req, res) => {
    let delivery_adress_json = "lieferAdresse";
    let billing_adress_json = "rechnungsAdresse";

    let delivery_adress = new Adresse(req.body[delivery_adress_json]["vorname"], req.body[delivery_adress_json]["nachname"], req.body[delivery_adress_json]["strasse"], req.body[delivery_adress_json]["nr"], req.body[delivery_adress_json]["plz"], req.body[delivery_adress_json]["ort"]);
    let billing_adress = new Adresse(req.body[billing_adress_json]["vorname"], req.body[billing_adress_json]["nachname"], req.body[billing_adress_json]["strasse"], req.body[billing_adress_json]["nr"], req.body[billing_adress_json]["plz"], req.body[billing_adress_json]["ort"]);
    if (req.body["bestellung"]["type"]) {
        con.query('select create_order(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [delivery_adress.vorname, delivery_adress.nachname, delivery_adress.strasse, delivery_adress.nr, delivery_adress.plz, delivery_adress.ort,
                billing_adress.vorname, billing_adress.nachname, billing_adress.strasse, billing_adress.nr, billing_adress.plz, billing_adress.ort,
                req.body["bestellung"]["type"], req.body["bestellung"]["anzahl"] , req.body["token"] ? req.body["token"] : "null"],
            (err, result) => {
                if (err) {
                    res.status(400).json({error: err["sqlMessage"]}).send()
                } else {
                    res.status(202).json({id: Object.values(JSON.parse(JSON.stringify(result))[0]).toString()}).send()
                }
            }
        )
    } else {
        let ids = [];
        for (const type in req.body["bestellung"]) {
            con.query('select create_order(?,?,?,?,?,?,?,?,?,?,?,?,?,?,null)', [delivery_adress.vorname, delivery_adress.nachname, delivery_adress.strasse, delivery_adress.nr, delivery_adress.plz, delivery_adress.ort,
                    billing_adress.vorname, billing_adress.nachname, billing_adress.strasse, billing_adress.nr, billing_adress.plz, billing_adress.ort,
                    type, req.body["bestellung"][type]],
                //todo
                (err, result) => {
                    if (err) {
                        ids.push(-1)
                    } else {
                        ids.push(Object.values(JSON.parse(JSON.stringify(result))[0]).toString())
                    }
                }
            )
        }
        //todo send id's back
        res.status(200).send()
    }
})


router.get("/orders", (req, res) => {
    con.query('select * from Auftrag', (err, result) => {
        res.send(repairQuery(result))
    })
});

router.get("/order", (req, res) => {
    con.query('select * from Auftrag Where id = ?', [req.query["order"]], (err, result) => {
        res.send(repairQuery(result))
    })
});

router.get("/order/status", (req, res) => {
    con.query('select status from Auftrag Where id = ?', [req.query["order"]], (err, result) => {
        console.log(result)
        res.send(repairQuery(result))
    })
});

router.get("/products", (req, res) => {
    con.query('select * from Produkt', (err, result) => {
        res.send(repairQuery(result))
    })
});

function repairQuery(sqlQuery) {
    return JSON.parse(JSON.stringify(sqlQuery));
}

module.exports = router;