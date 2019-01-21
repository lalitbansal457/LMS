import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Route, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

	public resetForm:FormGroup;
	public oldPassErr:boolean = false;
	public passwordErr:boolean = false;
	public employeeId:string = '';


  constructor(public userService:UserService, public route:ActivatedRoute) {
  	this.route.queryParams.subscribe(params => {
  	        this.employeeId = params['employeeId'];
  	        console.log(this.employeeId)
  	    });

  	this.resetForm = new FormGroup({
  		'oldPassword': new FormControl('', Validators.required),
  		'password': new FormControl('', Validators.required),
  		'confirmPassword': new FormControl('', Validators.required),
  		'employeeId': new FormControl(this.employeeId, Validators.required)
  	})
  		console.log(this.resetForm.value);

  	
   }

  ngOnInit() {
  	console.log(this.route.snapshot.paramMap.get('employeeId'));




  }

  resetControl() {	
  		if(this.resetForm.value) {
  			this.userService.resetPassword(this.resetForm.value).subscribe(res =>{

  			})
  		}
  }

}
