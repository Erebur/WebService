const con = require("../objects/DBconnection");

const Adresse = require("../objects/adresse");
const express = require('express');
const router = express.Router();

router.post("/order", async (req, res) => {
    // console.log(req)
    // console.log(req.body)
    //waits for the last query to be completed and returns the Ids
    let waitForIds = async function (delivery_address, billing_address) {
        return new Promise((resolve, reject) => {
            let ids = [];
            let i = 0
            for (const type in req.body["bestellung"]) {
                con.query('select create_order(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [delivery_address.vorname, delivery_address.nachname, delivery_address.strasse, delivery_address.nr, delivery_address.plz, delivery_address.ort, billing_address.vorname, billing_address.nachname, billing_address.strasse, billing_address.nr, billing_address.plz, billing_address.ort, type, req.body["bestellung"][type], req.body["token"] ? req.body["token"] : "null"], (err, result) => {
                    if (err) {
                        // ids.push(-1)
                    } else {
                        ids.push(Object.values(JSON.parse(JSON.stringify(result))[0]).toString())
                    }
                    if (i === Object.values(req.body["bestellung"]).length - 1) {
                        resolve(ids)
                    }
                    i++;
                })
            }
        })
    }

    let delivery_address_json = "lieferAdresse";
    let billing_address_json = "rechnungsAdresse";
    //if there is no order we just abort the transaktion
    if (!req.body["bestellung"]) {
        res.status(400)
        res.append("message", "Json not valid")
        res.send({"message": "Json not valid"})
        // console.log(res)
        return
    }
    if (req.body["bestellung"]["type"]) {
        //check if someone uses the old format
        res.status(301)
        res.send("format deprecated")
        return
    }

    checktoken(req.body["token"]).then(token_valid => {
        //if there is no delivery address we assume, we have an address saved already
        if (req.body[delivery_address_json]) {
            let delivery_address = new Adresse(req.body[delivery_address_json]["vorname"], req.body[delivery_address_json]["nachname"], req.body[delivery_address_json]["strasse"],  req.body[delivery_address_json]["hausnummer"] || req.body[delivery_address_json]["nr"], req.body[delivery_address_json]["plz"] || req.body[delivery_address_json]["postleitzahl"] , req.body[delivery_address_json]["ort"]);
            let billing_address = new Adresse(req.body[billing_address_json]["vorname"], req.body[billing_address_json]["nachname"], req.body[billing_address_json]["strasse"], req.body[billing_address_json]["nr"] || req.body[billing_address_json]["hausnummer"], req.body[billing_address_json]["plz"]|| req.body[billing_address_json]["postleitzahl"], req.body[billing_address_json]["ort"]);

            // Checks that each attribute has a value
            if (delivery_address.atribsAsArray().filter(e => e.toString().length !== 0).length !== 6 && billing_address.atribsAsArray().filter(e => e.toString().length !== 0).length !== 6) {
                res.status(401).append("message", "Adresse nicht vollständig").send()
            } else {
                waitForIds(delivery_address, billing_address).then(value => {
                    res.status(200)
                    if (!token_valid) {
                        //we decided to save the orders even if the token is invalid
                        res.status(401)
                        res.append("message", "token invalid")
                    }
                    res.send(value)
                })
            }
        } else if (token_valid) {
            con.query("SELECT a.vorname, a.nachname ,a.strasse, a.hausnummer  ,a.postleitzahl ,a.ort from Adresse_User au inner join Adresse a on au.Adresse_id=a.id inner join Users u on u.id = au.User_id where u.API_TOKEN = ?", [req.body["token"]], (err, result) => {
                let repairQueryElement = repairJson(result)[0]
                if (repairQueryElement) {
                    let delivery_address = new Adresse(repairQueryElement["vorname"], repairQueryElement["nachname"], repairQueryElement["strasse"], repairQueryElement["hausnummer"], repairQueryElement["postleitzahl"], repairQueryElement["ort"]);
                    waitForIds(delivery_address, delivery_address).then(value => {
                        res.status(200)
                        res.send(value)
                    })
                } else {
                    res.status(401)
                    res.send("no default address for user")
                }
            })
        } else {
            //if the token is invalid we won't find a default address for the user
            res.status(400)
            res.send("token invalid, cannot get address")
        }
    })
})

router.get("/orders", (req, res) => {
    checktoken(req.query["token"]).then(r => {
        if (r) {
            con.query('select * from Auftrag where user_id = (select u.id from Users u WHERE u.API_TOKEN = ?)', [req.query["token"]], (err, result) => {
                res.send(repairJson(result))
            })
        } else {
            con.query('select * from Auftrag', (err, result) => {
                res.send(repairJson(result))
            })
        }
    })
});

router.get("/order", (req, res) => {
    con.query('select * from Auftrag Where id = ?', [req.query["order"]], (err, result) => {
        res.send(repairJson(result))
    })
});

router.get("/order/status", (req, res) => {
    con.query('select status from Auftrag Where id = ?', [req.query["order"]], (err, result) => {
        res.send(repairJson(result))
    })
});

router.get("/products", (req, res) => {
    con.query('select * from Produkt', (err, result) => {
        res.send(repairJson(result))
    })
});

module.exports = router;
