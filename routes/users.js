const express = require('express');
const router = express.Router();
const con = require("../objects/DBconnection");
const crypto = require("crypto")

router.post('/login',(req , res) => {
    con.query('SELECT API_TOKEN,UNIX_TIMESTAMP(expiration_date) ed FROM `Users` WHERE Username = ? AND Password = ?',[req.body["username"], req.body["password"]],(error , result) =>{
        if (repairQuery(result)[0]){
            let ed = new Date(repairQuery(result)[0]["ed"] * 1000);
            let token
            console.log(ed)
            if (ed > Date.now()){
                token = repairQuery(result)[0]["API_TOKEN"]
                res.status(200).json({"token" : token}).send()
            }else{
                token = crypto.randomUUID()
                token = token.replace(/-/g,'').substring(0, 10)
                con.query('Update Users set API_TOKEN = ? ,expiration_date = date_add(current_timestamp, interval ? minute)  where Username = ?',[token , req.body["token_duration"] ? req.body["token_duration"]  : 10  , req.body["username"]])
                res.status(200).json({"token" : token, "status" : "Token updated"}).send()
            }
        }else{
            res.status(402).send()
        }

    })
})

router.post('/create', function (req, res, next) {
    let token = crypto.randomUUID()
    token = token.replace(/-/g,'').substring(0, 10)
    con.query('select create_user(?,?,?)', [req.body["username"], req.body["password"], token], (err, result) => {
        res.send({token:(Object.values(JSON.parse(JSON.stringify(result))[0]).toString() !== "0" ? token : "invalid")})
    })
});

router.get('/orders', function (req, res, next) {
    con.query('select * from Auftrag where user_id = (select u.id from Users u WHERE u.API_TOKEN = ?)', [req.query["token"]], (err, result) => {
        res.send(repairQuery(result))
    })
});

function repairQuery(sqlQuery) {
    return JSON.parse(JSON.stringify(sqlQuery));
}

module.exports = router;
