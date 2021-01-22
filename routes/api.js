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

import {action, get, post, put} from "../config/routes";

import StoreController from "../app/controllers/StoreController";
import AuthController from "../app/controllers/auth/AuthController";

export default class ApiController {

   constructor() {
      this.store = new StoreController();
      this.auth = new AuthController();
   }

   @get('/stores')
   stores(req, res, next) {
      this.store.storeList(req, res, next);
   }

   @get('/store/:id')
   store(req, res) {
      this.store.storeDetail(req, res);
   }

   @get('/search/:query')
   search(req, res) {
      this.store.storeSearch(req, res);
   }

   @put('/store/update/:id')
   update(req, res) {
      this.store.update(req, res);
   }

   @post('/oauth')
   oauth(req, res) {
    this.auth.ologin(req, res);
   }
}
