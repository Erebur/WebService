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
                console.log(repairQuery(result))
                //test Password Hash
                bcrypt.compare(req.body["password"], repairQuery(result)[0]["Password"], function(error, response) {
                    if (response){
                        let ed = new Date(repairQuery(result)[0]["ed"] * 1000), token;
                        if (ed > Date.now()) {
                            token = repairQuery(result)[0]["API_TOKEN"]
                            res.status(200).json({"token": token}).send()
                        } else {
                            token = crypto.randomUUID()
                            token = token.replace(/-/g, '').substring(0, 10)
                            con.query('Update Users set API_TOKEN = ? ,expiration_date = date_add(current_timestamp, interval ? minute)  where Username = ?', [token, req.body["token_duration"] ? req.body["token_duration"] : 10, req.body["username"]])
                            res.status(200).json({"token": token, "status": "Token updated"}).send()
                        }
                    }else {
                        res.status(401).send()
                    }
                });
            }else {
                res.status(401).send()
            }

        })
})

router.post('/create', function (req, res, next) {
    let token = crypto.randomUUID()
    token = token.replace(/-/g, '').substring(0, 10)
    bcrypt.hash(req.body["password"],saltRounds ,(err , hash)=>{
        console.log(hash)
        con.query('select create_user(?,?,?)', [req.body["username"],hash, token], (err, result) => {
            res.send({token: (Object.values(JSON.parse(JSON.stringify(result))[0]).toString() !== "0" ? token : "invalid")})
        })
    })
});

module.exports = router;
