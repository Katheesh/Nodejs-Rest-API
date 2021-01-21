import mysqlSetup from '../../config/mysql';

import dotenv from "dotenv";

import jwt from 'jsonwebtoken';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

export default class StoreController {

	constructor() {
		this.mysql = new mysqlSetup();
	}

	tokenVerify(token) {

		jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {	
			
			console.log(decoded);
   	
		    return decoded;
	    });
	}

	async storeList(req, res) {
		//Display a listing of the resource.
		if (req.headers.authorization) {
			//var approveStatus =  await this.tokenVerify(req.headers.authorization);
			//console.log(approveStatus);\\

/*			let q = 'SELECT store_id, name FROM stores;';
			this.mysql.selectQuery(req, res, q);*/

			jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, decoded) {	
			
				console.log(decoded);
				let q = 'SELECT store_id, name FROM stores;';
				const rest = this.mysql.selectQuery(req, res, q);

				/*if ( decoded != undefined) {
					
				} 
				else
				{
					return res.status(401).json({
			          	message: "UnAuthorized",
			        });
				}*/

		    });

			

		} else {
		    return res.status(401).json({
		      message: "UnAuthorized",
		    });
		}
	} 

	async storeDetail(req, res) {
		//Display a record.
		if (req.headers.authorization) {
			if (this.tokenVerify(req, res, req.headers.authorization) == 1) {
				let storeID = req.params.id
				let q = 'SELECT * FROM stores WHERE store_id = '+storeID+';';
				this.mysql.selectQuery(req, res, q);
			}
			
		} else {
		    return res.status(401).json({
		      message: "UnAuthorized",
		    });
		}
	}

	async storeSearch(req, res) {
		//Display a record.
		if (req.headers.authorization) {
			if (this.tokenVerify(req, res, req.headers.authorization) == 1) {
				let searchquery = req.params.query
				let q = 'SELECT store_id, name FROM stores WHERE name  LIKE "%'+searchquery+'%" LIMIT 5;';
				this.mysql.selectQuery(req, res, q);
			}
			
		} else {
		    return res.status(401).json({
		      message: "UnAuthorized",
		    });
		}
	} 

	create(req, res) {
		//Show the form for creating a new resource.
	}

	store(req, res) {
		//Store a newly created resource in storage.
	} 

	update(req, res) {
		//Update the specified resource in storage.
		if (req.headers.authorization) {
			if (this.tokenVerify(req, res, req.headers.authorization) == 1) {

				if (req.body.name) {
				    let name = req.body.name;
				} else {
				  	return res.status(204).json({
				      message: "Need more information for update resource.",
				    });
				}
				if (req.body.description) {
				    let desc = req.body.description;
				} else {
				    return res.status(204).json({
				      message: "Need more information for update resource.",
				    });
				}
				if (req.params.id) {
				    let storeID = req.params.id;
				} else {
				    return res.status(204).json({
				      message: "Need more information for update resource.",
				    });
				}

				let q = 'UPDATE `stores` SET `name` = "'+ name +'", `description` = "'+ desc +'" WHERE `stores`.`store_id` = '+ storeID +';';
				//console.log(q);
				this.mysql.updateQuery(req, res, q)
			}
			
		} else {
		    return res.status(401).json({
		      message: "UnAuthorized",
		    });
		}
		
	} 

	destroy(req, res) {
		//Remove the specified resource from storage.
	} 
  
}