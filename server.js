
var express = require('express')
var app = express();
var path = require('path')
app.use(express.static(__dirname + '/'));
/**
 * @parameter segmentName
 * @parameter x_switch_user
 * @parameter username
 * @parameter password
 * @parameter apikey
 * @parameter userlist
 */
var response="";
app.get('/api/setSegment',function(req,res) {
    if(req.query.segment && req.query.switch && req.query.username && req.query.password && req.query.apikey && req.query.userlist) {
        var userList=req.query.userlist.split(",");
        var bodyToken = "";
        var segmentName=req.query.segment;
        var xSwitchUser=req.query.switch;
        var request = require('request');
        var tokkenForm = {
            username: req.query.username,
            password: req.query.password,
        };
        response = res;
        // token almak için istek
        request({
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            // api url'imiz
            uri: 'https://panel-api.segmentify.com/getToken',
            json: tokkenForm,
            method: 'POST'
        }, function (err, res, body) {
            // statics için istek
            bodyToken = body.token;
            request({
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    // bu gerekli Segmentify auth key. Bu değişken burada bir çözüm bulmak gerekiyor.
                    'Authorization': bodyToken,
                    'X-Switch-User': xSwitchUser
                },
                // api url'imiz
                uri: "https://dce1.segmentify.com/add/segment/"+segmentName+"?apiKey="+req.query.apikey,
                json: userList,
                method: 'POST'
            }, function (err, res, body) {
                response.status(200)
                .send(res.body);
            });
        });    
    }else {
        res.status(200)
        .send("Eksik veri girdiniz.");
    }
   
});
app.listen("3000", "127.0.0.1", () => {
  console.log('');
});