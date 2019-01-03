import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ConstantService} from './constant.service';
import { map ,catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, public constantService:ConstantService ) { }


  register(obj) {
  	return this.http.post(this.constantService.apiUrl + '/register', obj).pipe(map((res:any)=>{
  		return res;
  	}), 
  	catchError(error=>{
  		throw(error);
  	})
  	)
  }

  login(obj) {
  	console.log(obj)
  	return this.http.post(this.constantService.apiUrl + '/login', obj).pipe(map((res:any)=>{
  		return res;
  	}), 
  	catchError(error=>{
  		throw(error);
  	})
  	)
  }


  applyLeave(obj) {
  	console.log(obj)
  	return this.http.post(this.constantService.apiUrl + '/apply-leave', obj).pipe(map((res:any)=>{
  		return res;
  	}), 
  	catchError(error=>{
  		throw(error);
  	})
  	)
  }

  getOwnLeaveData(obj) {
  	console.log(obj);
  	return this.http.post(this.constantService.apiUrl + '/get-leave-data', obj).pipe(map((res:any)=>{
  		return res;
  	}), 
  	catchError(error=>{
  		throw(error);
  	})
  	)
  }


  getEmpLeaveData(obj) {
  	return this.http.post(this.constantService.apiUrl + '/get-emp-leave-data', obj).pipe(map((res:any)=>{
  		return res;
  	}), 
  	catchError(error=>{
  		throw(error);
  	})
  	)
  }

  updateLeaveStatus(obj) {
  	return this.http.post(this.constantService.apiUrl + '/update-leave-status', obj).pipe(map((res:any)=>{
  		return res;
  	}), 
  	catchError(error=>{
  		throw(error);
  	})
  	)
  }




  
}
