var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

    // DB connent string
    var connect = "postgres://admin:140655@localhost/recipebookdb";

    //Assign Dust Engine to .dust files

    app.engine('dust', cons.dust);

    //Set Default Ext .dust

    app.set('view engine', 'dust');
    app.set('views', __dirname + '/views');

    // Set Public Folder

    app.use(express.static(path.join(__dirname, 'public')));

    //Body Parser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    const { Pool } = require('pg')
    const pool = new Pool({
        connectionString: connect,
      })

    app.get("/", function(req, res, next) {
        pool.connect(function(err, client, done) {
            if (err) {
                console.log("not able to get connection " + err);
                res.status(400).send(err);
            }
            client.query("SELECT * FROM recipes", function(err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
                res.render('index', {recipes:result.rows});
                done();
            });
        });
    });






    // app.get('/', function(req,res){
    //     //PG Connect
    //     pg.connect(connect, function(err, client, done){
    //         if (err){
    //             return console.error('erroe fetching client from pool',err);
    //         }
    //         client.query('SELECT * FROM recipes', function(err, result){
    //         if(err){
    //             return console.error('error running query', err);
    //         }
    //         res.render('index', {recipes:result.rows});
    //         done();    

    //         });
    //     });
    // });

    //Server
    app.listen(3000, function(){
        console.log('Server Started on Port 3000');
    })