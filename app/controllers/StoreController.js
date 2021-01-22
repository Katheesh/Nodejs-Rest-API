import mysqlSetup from '../../config/mysql';

import dotenv from "dotenv";

import jwt from 'jsonwebtoken';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

export default class StoreController {

	constructor() {
		this.mysql = new mysqlSetup();
	}


	async storeList(req, res, next) {
		//Display a listing of the resource.

		if (req.headers.authorization) {
			try{
				const decoded = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

				if ( decoded != undefined) {
					let q = 'SELECT store_id, name FROM stores;';
					await this.mysql.selectQuery(req, res, q);
				} 
				else
				{
					return res.status(401).json({
			          	message: "UnAuthorized",
			        });
				}
			}
			catch(e){
		    	res.status(400).json({message: 'Token not valid'})
		   	}

		} else {
		    return res.status(401).json({
		      message: "UnAuthorized",
		    });
		}
	} 

	async storeDetail(req, res) {
		//Display a record.
		if (req.headers.authorization) {
			try{
				const decoded = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

				if ( decoded != undefined) {
					let storeID = req.params.id
					let q = 'SELECT * FROM stores WHERE store_id = '+storeID+';';
					this.mysql.selectQuery(req, res, q);
				} 
				else
				{
					return res.status(401).json({
			          	message: "UnAuthorized",
			        });
				}
			}
			catch(e){
		    	res.status(400).json({message: 'Token not valid'})
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
			try{
				const decoded = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

				if ( decoded != undefined) {
					let searchquery = req.params.query
					let q = 'SELECT store_id, name FROM stores WHERE name  LIKE "%'+searchquery+'%" LIMIT 5;';
					this.mysql.selectQuery(req, res, q);
				} 
				else
				{
					return res.status(401).json({
			          	message: "UnAuthorized",
			        });
				}
			}
			catch(e){
		    	res.status(400).json({message: 'Token not valid'})
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

	async update(req, res) {

		//Update the specified resource in storage.
		if (req.headers.authorization) {
			try{
				const decoded = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
				console.log(decoded);
				if ( decoded != undefined) {

					let name, desc, storeID;
					
					if (req.body.name) {
					    name = req.body.name;
					} else {
					  	return res.status(204).json({
					      message: "Need more information for update resource.",
					    });
					}
					if (req.body.description) {
					    desc = req.body.description;
					} else {
					    return res.status(204).json({
					      message: "Need more information for update resource.",
					    });
					}
					if (req.params.id) {
					    storeID = req.params.id;
					} else {
					    return res.status(204).json({
					      message: "Need more information for update resource.",
					    });
					}

					let q = 'UPDATE `stores` SET `name` = "'+ name +'", `description` = "'+ desc +'" WHERE `stores`.`store_id` = '+ storeID +';';
					//console.log(q);
					this.mysql.updateQuery(req, res, q)
				} 
				else
				{
					return res.status(401).json({
			          	message: "UnAuthorized",
			        });
				}
			}
			catch(e){
		    	res.status(400).json({message: 'Token not valid'})
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