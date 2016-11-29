var express = require('express');
var spawn = require('child_process').spawn;
var router = express.Router();

spawn('gpio', ["pinMode", "17", "INPUT", "0"]);
spawn('gpio', ["pinMode", "27", "INPUT", "0"]);
spawn('gpio', ["pinMode", "22", "INPUT", "0"]);
spawn('gpio', ["pinMode", "18", "INPUT", "0"]);


// Middleware for all this routers requests
router.use(function timeLog(req, res, next) {
    console.log('Peticion de puertas recibida: ', dateDisplayed(Date.now()));
    next();
});

//Obtiene los datos de puertas
router.route('/')
        .get(function (req, res) {

            run("17", function (p1) {
                run("27", function (p2) {
                    run("22", function (p3) {
                        run("18", function (p4) {
                            res.json({p1:invertir(p1), p2:invertir(p2),
                                p3: invertir(p3), p4: invertir(p4)});
                        });
                    });
                });
            });
        });

module.exports = router;

function run(pin, callback) {
    var command = spawn('gpio', ["digitalRead", pin, "", ""]);
    var result = '';
    command.stdout.on('data', function (data) {
        result += data.toString();
    });
    command.on('close', function (code) {
        return callback(result);
    });
}
function invertir(num) {
    if (num === "1"){
        num = 0;
    }else{
        num = 1;
    }
    return num;
}

function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}