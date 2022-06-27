const express = require('express');
const router = express.Router();
const con = require("../objects/DBconnection");
const crypto = require("crypto")
const bcrypt = require('bcrypt')
const {hash} = require("bcrypt");
const saltRounds = 10;


router.post('/login', (req, res) => {
    con.query('SELECT API_TOKEN,UNIX_TIMESTAMP(expiration_date) ed,Password FROM `Users` WHERE Username = ?',
        [req.body["username"], req.body["password"]],
        (error, result) => {
            if (repairQuery(result)[0]) {
                //test Password Hash
                bcrypt.compare(req.body["password"], repairQuery(result)[0]["Password"], function (error, response) {
                    if (response) {
                        // login accepted
                        if (req.body["new_password"]){
                            bcrypt.hash(req.body["new_password"], saltRounds , (err, hash) =>{
                                con.query('Update Users SET password = ? WHERE Username = ?',
                                    [hash, req.body["username"]])
                            })
                        }
                        let ed = new Date(repairQuery(result)[0]["ed"] * 1000), token;
                        if (ed > Date.now()) {
                            token = repairQuery(result)[0]["API_TOKEN"]
                            res.status(200).json({"token": token}).send()
                        // old token returned
                        } else {
                            token = crypto.randomUUID()
                            token = token.replace(/-/g, '').substring(0, 10)
                            con.query('Update Users set API_TOKEN = ? ,expiration_date = date_add(current_timestamp, interval ? minute)  where Username = ?', [token, req.body["token_duration"] ? req.body["token_duration"] : 10, req.body["username"]])
                            res.status(200).json({"token": token, "status": "Token updated"}).send()
                        // new token returned
                        }
                    } else {
                        res.status(401).send()
                    }
                });
            } else {
                res.status(401).send()
            }

        })
})

router.post('/create', function (req, res, next) {
    let token = crypto.randomUUID()
    token = token.replace(/-/g, '').substring(0, 10)
    bcrypt.hash(req.body["password"], saltRounds, (err, hash) => {
        con.query('select create_user(?,?,?)', [req.body["username"], hash, token], (err, result) => {
            if (err)
                res.sendStatus(409)
            else
                res.send({token: (Object.values(JSON.parse(JSON.stringify(result))[0]).toString() !== "0" ? token : "invalid")})
        })
    })
});

router.get('/address', (req, res) => {
    checktoken(req.query["token"]).then(value => {
        if (value) {
            con.query("SELECT a.vorname, a.nachname ,a.strasse, a.hausnummer  ,a.postleitzahl ,a.ort from Adresse_User au inner join Adresse a on au.Adresse_id=a.id inner join Users u on u.id = au.User_id where u.API_TOKEN = ?", [req.query["token"]],
                (err, result) => {
                    res.status(200)
                    res.send(repairQuery(result)[0])
                })
        } else {
            res.sendStatus(401)
        }
    })
})

router.post('/address', (req, res) => {
    con.query("Select add_address_to_user(?,?,?,?,?,?,?)", [req.body["vorname"], req.body["nachname"], req.body["strasse"], req.body["hausnummer"], req.body["plz"], req.body["ort"], req.body["token"]],
        (err, result) => {
            if (err) {
                res.append("err", err)
                res.sendStatus(400)
                return
            }
            if (Object.values(repairQuery(result)[0]).toString() === "1") {
                res.sendStatus(200)
            } else res.status(401).send("Token not found")
        })
})
module.exports = router;