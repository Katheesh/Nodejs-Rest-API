/* The NodeJS Framework for Smart Back-End
   ▄█   ▄█▄    ▄████████    ▄████████    ▄████████ ▄██   ▄   
  ███ ▄███▀   ███    ███   ███    ███   ███    ███ ███   ██▄ 
  ███▐██▀     ███    ███   ███    █▀    ███    █▀  ███▄▄▄███ 
 ▄█████▀      ███    ███   ███         ▄███▄▄▄     ▀▀▀▀▀▀███ 
▀▀█████▄    ▀███████████ ▀███████████ ▀▀███▀▀▀     ▄██   ███ 
  ███▐██▄     ███    ███          ███   ███        ███   ███ 
  ███ ▀███▄   ███    ███    ▄█    ███   ███        ███   ███ 
  ███   ▀█▀   ███    █▀   ▄████████▀    ███         ▀█████▀  
  ▀ Author : S.Katheeskumar [https://katheesh.github.io] */
  
import mysql  from "mysql";

import dotenv from "dotenv";

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

export default class mysqlConnection {

	constructor() {

		this.host     = process.env.DB_HOST;
		this.user     = process.env.DB_USER;
		this.password = process.env.DB_PASS;
		this.database = process.env.DB_NAME;

		this.connection = mysql.createConnection({
			host     : this.host,
			user     : this.user,
			password : this.password,
			database : this.database
		});
		
		this.connection.connect(function(err){
			if(!err) {
			    console.log("\n\t✅ Database is connected ... \n");
			} else {
			    console.log("\n\t❌ Connecting error to the database ... \n\n");
			}
		});
	}

	async selectQuery(req, res, query){
		this.connection.query(query, function(error, results, fields) {
			if (error) {
				console.log("Error: " + error);
			}
			if (results) {
				return res.json(results);
			}	
		});
	}

	async updateQuery(req, res, query){
		this.connection.query(query, function(error, results, fields) {
			if (error) {
				console.log("Error: " + error);
			}
			if (results) {
				return res.json({status: 200, data:results});
			}	
		});
	}


	async login(req, res, email, password){

		this.connection.query('SELECT * FROM users WHERE email = ? LIMIT 1;', 
			[email], function(error, results, fields) {
				var StrResult = JSON.stringify(results);
				var pureJson = JSON.parse(StrResult);
				var dbpswd = pureJson[0].password;

			bcrypt.compare(password, dbpswd, (err, result) => {
			  // res == true or res == false
			  	if (result == true) {

				  	req.session.loggedin = true;
					req.session.username = email;
					console.log("record fetched success ... \n");
					//return {"status" :true, "code": 200};
					return res.redirect("/home");
					//return res.render("home");

				} else {
					//console.log("record fetching failed ... \n");
					//return false;
					return res.render("auth/login", {
					    errors: {
					      	email: {
					        	msg: 'Incorrect Email or Password'
					      	},
					      	password: {
					        	msg: 'Incorrect Email or Password'
					      	}
					    }
					});
				}
			});				
		});
	}

	async ologin(req, res, email, password){

		this.connection.query('SELECT * FROM users WHERE email = ? LIMIT 1;', 
			[email], function(error, results, fields) {
			if(results.length > 0) {
				var StrResult = JSON.stringify(results);
				var pureJson = JSON.parse(StrResult);
				var dbpswd = pureJson[0].password;

				bcrypt.compare(password, dbpswd, (err, result) => {
				  // res == true or res == false
				  	if (result == true) {

				  		const payload = { user: email };
		                const options = { expiresIn: '2d', issuer: 'https://sample.domain' };
		                const secret = process.env.JWT_SECRET;
		                const token = jwt.sign(payload, secret, options);

						return res.json({loggedin: email, token: token});

					} else {
						return res.json({loggedin: null, token: null});
					}
				});	
			} else {
				return res.json({loggedin: null, token: null});
			}		
		});
	}

	async register(req, res, username, email, password){

		let rounds = 10

	/*	bcrypt.hash(password, rounds, (err, hash) => {
		  if (err) {
		    console.error(err)
		    return
		  }
		  var hashpass = hash;
		})*/

		let hashprocess = async () => {
		  	let hash = await bcrypt.hash(password, rounds)
		  	//console.log(hash)
		  	//console.log(await bcrypt.compare(password, hash))

		  	this.connection.query('INSERT INTO users VALUES (NULL, ?, ?, ?);', 
				[username, email, hash], function(error, results, fields) {
				if (error) {
					console.log("Error: " + error);
					return res.render("auth/register", {
						req: req,
					    errors: {
					      	username: {
					        	msg: error
					      	},
					      	email: {
					        	msg: error
					      	},
					      	password: {
					        	msg: error
					      	}
					    }
					});
				}
				if (results) {
	    			req.session.loggedin = true;
					req.session.username = email;

					return res.redirect("/home");
				}	
			});
		}

		hashprocess();

		
	}
}