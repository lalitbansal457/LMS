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
  public managerList:any = [];
  public leadList:any = [];
  public hrList:any = [];
  public userType:any = ['Team member', 'manager', 'lead', 'hr'];

  constructor(public userService:UserService) {

    var fields = {'employeeId': 1, 'name': 1, 'email': 1, '_id':0};

    this.getUserData({'query':{'userType': 'manager'}, 'fields': fields}, 'manager');

    this.getUserData({'query':{'userType': 'hr'}, 'fields': fields}, 'hr');

    this.getUserData({'query':{'userType': 'lead'}, 'fields': fields}, 'lead');
   


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
  		'lead': new FormControl(null),
  		'manager': new FormControl({}, [
  			Validators.required
  		]),
      'hr': new FormControl('', [
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

  getUserData(obj, userType) {
    this.userService.getUserData(obj).subscribe(res =>{

      if(userType == 'manager') {
        this.managerList = res;
         console.log(this.managerList);
      } else if(userType == 'lead') {
        this.leadList = res;
      } else {
        this.hrList = res;
      }
    })
  }


  registerControl() {
    //console.log(this.registerForm.controls['manager'].value);

    if(!this.registerForm.valid) {
      // updating the value
      this.setFormFieldValue(this.registerForm.controls['manager'].value, 'manager');
      this.setFormFieldValue(this.registerForm.controls['hr'].value, 'hr');
      if(this.registerForm.controls['lead'].value) {
        this.setFormFieldValue(this.registerForm.controls['lead'].value, 'lead');
      }

      this.userService.register(this.registerForm.value).subscribe();
    }
  	
  }

  setFormFieldValue(formFieldValue, fieldName) {
    this.registerForm.controls[fieldName].setValue({
      'id': formFieldValue['employeeId'],
      'email': formFieldValue['email'],
      'name': formFieldValue['name'],
    })

    //return this.registerForm;
  }

}
