import { Component, OnInit } from '@angular/core';
import  {HttpClient} from '@angular/common/http';
import { map , catchError } from 'rxjs/operators';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {Router} from '@angular/router'; 

import {ConstantService} from '../services/constant.service'
import {UserService} from '../services/user.service'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm:FormGroup;

  constructor(private http:HttpClient, public constantService:ConstantService, public userService:UserService, private router:Router) { 
    localStorage.clear();
    
    this.loginForm = new FormGroup({
      'employeeId': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    })

  }

  ngOnInit() {
  }

  loginControl() {
  	this.userService.login(this.loginForm.value).subscribe((res)=>{
  		console.log(res);
      if(res.length) {
        localStorage.setItem('userData', JSON.stringify(res[0]));
        this.router.navigate(['dashboard']);
      }
  	})
  }

}
