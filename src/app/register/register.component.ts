import { Component, OnInit } from '@angular/core';

import {FormGroup, Validators, FormControl} from '@angular/forms';

import {UserService} from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


	public registerForm:FormGroup;

  constructor(public userService:UserService) {
  	this.registerForm = new FormGroup({
  		'name' :new FormControl('', [
  			Validators.required
  		]),
  		'password': new FormControl('', [
  			Validators.required
  		]),
  		'employeeId': new FormControl('', [
  			Validators.required
  		]),
      'email': new FormControl('', [
        Validators.required
      ]),
  		'leadId': new FormControl('', [
  			Validators.required
  		]),
  		'managerId': new FormControl('', [
  			Validators.required
  		]),
  		'CL': new FormControl('', [
  			Validators.required
  		]),
  		'SL': new FormControl('', [
  			Validators.required
  		]),
  		'EL': new FormControl('', [
  			Validators.required
  		]),
      'userType': new FormControl('', [
        Validators.required
       ])
  	})
  }

  ngOnInit() {
  }


  registerControl() {
  	console.log(this.registerForm.valid);

    if(this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe();
    }
  	
  }

}
