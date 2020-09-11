#!/usr/bin/env node
var express = require('express');
var fs = require('fs');

var makePage = function(html, opts){
    var options = opts || {};
    var htmlParts = Array.prototype.slice.call(arguments);
    return '<html><head></head><body>'+htmlParts.join('')+'</body></html>';
}

var enableFolders = function(names, app){
    names.forEach(function(name){
        app.get('/'+name+'/*', function(req, res) {
            //todo: safety
            streamFile('.'+req.url, res);
        });
    })
}

var streamFile = function(file, res, opts){
    var options = opts || {};
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err){
        res.end(err.toString());
    });
    fileStream.on('open', function(){
        fileStream.pipe(res);
    });
}

module.exports = {
    augment : function(instance, options){
        //todo: configurable endpoint names
        var links = [];
        links.push('<li><a href="/story">Read</a></li>');
        app.get('/story', function (req, res) {
            streamFile('./html/story.html', res);
        });
        if(options && options.gui){
            links.push('<li><a href="/calibrate">Calibrate</a></li>');
            app.get('/calibrate', function (req, res) {
                streamFile('./html/calibration.html', res);
            });
            enableFolders(['js', 'node_modules', 'css', 'test'], app);
            app.get('/webgazer.min.js', function(req, res){
                //todo: safety
                streamFile('./lib/webgazer.min.js', res);
            });
            app.get('/webgazer.min.js.map', function(req, res){
                //todo: safety
                streamFile('./webgazer.min.js.map', res);
            });
            links.push('<li><a href="/collision">Collision</a></li>');
            app.get('/collision', function (req, res) {
                streamFile('./html/collision.html', res);
            });
        }
        app.get('/story-teller.js', function (req, res) {
            streamFile('./node_modules/story-teller/dist/main.js', res);
        });
        app.get('/caption-teller.js', function (req, res) {
            streamFile('./node_modules/story-caption-teller/dist/main.js', res);
        });
        app.get('/background-teller.js', function (req, res) {
            streamFile('./node_modules/story-background-teller/dist/main.js', res);
        });
        app.get('/', function (req, res) {
            res.end(makePage([
                '<ul>'
                    ].concat(links).concat([
                '</ul>'
            ])));
        });
    }
};

if(require.main === module){
    var app = express();
    var port = 8080;
    module.exports.augment(app, {gui:true});
    app.listen(port, function(){
      console.log(`Example app listening at http://localhost:${port}`)
    });
}
