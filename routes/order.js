const con = require("../objects/DBconnection");

const Adresse = require("../objects/adresse");
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post("/order", async (req, res) => {
    let delivery_adress_json = "lieferAdresse";
    let billing_adress_json = "rechnungsAdresse";

    try {
        let delivery_adress = new Adresse(req.body[delivery_adress_json]["vorname"], req.body[delivery_adress_json]["nachname"], req.body[delivery_adress_json]["strasse"], req.body[delivery_adress_json]["nr"], req.body[delivery_adress_json]["plz"], req.body[delivery_adress_json]["ort"]);
        let billing_adress = new Adresse(req.body[billing_adress_json]["vorname"], req.body[billing_adress_json]["nachname"], req.body[billing_adress_json]["strasse"], req.body[billing_adress_json]["nr"], req.body[billing_adress_json]["plz"], req.body[billing_adress_json]["ort"]);
    }catch (TypeError){
        res.status(400)
        res.send({"message" : "Json not valid"})
        return
    }

    if (req.body["bestellung"]["type"]) {
        res.sendStatus(418)
        return
    }

    checktoken(req.body["token"]).then(token_valid => {
        waitForAnswer = async function(){
            return new Promise((resolve, reject) => {
                let ids = [];
                let i = 0
                for (const type in req.body["bestellung"]) {
                    con.query('select create_order(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [delivery_adress.vorname, delivery_adress.nachname, delivery_adress.strasse, delivery_adress.nr, delivery_adress.plz, delivery_adress.ort,
                            billing_adress.vorname, billing_adress.nachname, billing_adress.strasse, billing_adress.nr, billing_adress.plz, billing_adress.ort,
                            type, req.body["bestellung"][type], req.body["token"] ? req.body["token"] : "null"],
                        (err, result) => {

                            if (err) {
                                // ids.push(-1)
                            } else {
                                ids.push(Object.values(JSON.parse(JSON.stringify(result))[0]).toString())
                                console.log(Object.values(JSON.parse(JSON.stringify(result))[0]).toString())
                            }
                            if (i === Object.values(req.body["bestellung"]).length -1){
                                resolve(ids)
                            }
                            i++;
                        }
                    )

                }
            })
        }


        waitForAnswer().then(value => {
            console.log(value)
            res.status(200)
            if (!token_valid) {
                res.status(401)
            }
            res.send(value)
        })
    })

})

router.get("/orders", (req, res) => {
    checktoken(req.query["token"]).then(r => {
        if (r) {
            con.query('select * from Auftrag where user_id = (select u.id from Users u WHERE u.API_TOKEN = ?)', [req.query["token"]], (err, result) => {
                res.send(repairQuery(result))
            })
        }else {
            con.query('select * from Auftrag', (err, result) => {
                res.send(repairQuery(result))
            })
        }
    })
});

router.get("/order", (req, res) => {
    con.query('select * from Auftrag Where id = ?', [req.query["order"]], (err, result) => {
        res.send(repairQuery(result))
    })
});

router.get("/order/status", (req, res) => {
    con.query('select status from Auftrag Where id = ?', [req.query["order"]], (err, result) => {
        res.send(repairQuery(result))
    })
});

router.get("/products", (req, res) => {
    con.query('select * from Produkt', (err, result) => {
        res.send(repairQuery(result))
    })
});

module.exports = router;
