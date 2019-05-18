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
    
    app.post('/add', function(req,res) {
        pool.connect(function(err, client, done) {
            if (err) {
                
                console.log("not able to get connection " + err);
                res.status(400).send(err);
            }
            const query = {
                text: 'INSERT INTO recipes(name, ingredients, directions) VALUES($1,$2,$3)',
                values:  [req.body.name, req.body.ingredients, req.body.directions],
            }

        client.query(query, (err, result) => {
            res.redirect('/');
        });
               
        });
        
    });



    app.delete('/delete/:id', function(req,res){
        pool.connect(function(err, client, done) {
            if (err) {
                
                console.log("not able to get connection " + err);
                res.status(400).send(err);
            }
            const query = {
                text: 'DELETE FROM recipes WHERE id = $1',
                values:  [req.params.id],
            }

            client.query(query, (err, result) => {
                res.sendStatus(200);
            });
               
        });
    });

    
    app.post('/edit', function(req,res){
        pool.connect(function(err, client, done) {
           
            if (err) {
                
                console.log("not able to get connection " + err);
                res.status(400).send(err);
            }
            const query = {
                text: 'UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id = $4',
                values:  [req.body.name, req.body.ingredients, req.body.directions, req.body.id],
            }

            client.query(query, (err, result) => {
                res.redirect('/');
            });
               
        });
    });

    
    
    //Server
    app.listen(3000, function(){
        console.log('Server Started on Port 3000');
    })