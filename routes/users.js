const express = require('express');
const router = express.Router();
const con = require("../objects/DBconnection");

router.post('/create', function (req, res, next) {
    con.query('select create_user(?,?)', [req.body["username"], req.body["password"]], (err, result) => {
        res.send({id:Object.values(JSON.parse(JSON.stringify(result))[0]).toString()})
    })
});


router.get('/orders', function (req, res, next) {
    con.query('select * from Auftrag where user_id = ?' , [req.query["user"]], (err, result) => {
        res.send(repairQuery(result))
    })
});

function repairQuery(sqlQuery) {
  return JSON.parse(JSON.stringify(sqlQuery));
}
module.exports = router;
