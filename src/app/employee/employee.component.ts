import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';

import {UserService} from '../services/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit {

	public leaveForm:FormGroup;
	public userData: object;
	public leaveRequests: any = [];
  public succesMessage:boolean = false;

  constructor(public userService:UserService) { 
  	if(localStorage.getItem('userData') != null) {
  		this.userData = JSON.parse(localStorage.getItem('userData'));
      console.log(this.userData)
  	}

  	this.leaveForm = new FormGroup({
      'leaveType': new FormControl('', Validators.required),
  		'leaveFrom': new FormControl('', Validators.required),
  		'leaveTo': new FormControl('', Validators.required),
  		'fromFirstHalf': new FormControl(''),
  		'fromSecondHalf': new FormControl(''),
  		'toFirstHalf': new FormControl(''),
  		'leaveReason': new FormControl('', Validators.required),
  		'lead': new FormControl(this.userData['lead'], Validators.required),
      'manager': new FormControl(this.userData['manager'], Validators.required),
  		'hr': new FormControl(this.userData['hr'], Validators.required),
  		'employeeId': new FormControl(this.userData['employeeId'], Validators.required),
      'employeeName': new FormControl(this.userData['name'], Validators.required),
  		'employeeEmail': new FormControl(this.userData['email'], Validators.required),
  		'status': new FormControl({"lead": "pending","manager": "pending", "hr": "pending"}, Validators.required),
  		'submitDate': new FormControl(new Date(), Validators.required)
  	});
  	this.getLeaveData();
  }

  ngOnInit() {
  }

  applyLeave() {

    /*this.leaveForm.controls['leaveFrom'].value;
    this.leaveForm.controls['leaveTo'].value;*/   

  	this.userService.applyLeave(this.leaveForm.value).subscribe(res => {
      if(res.ok) {
        this.succesMessage = true;

        setTimeout(()=>{
          this.succesMessage = false;
        }, 2000);
      }
      this.leaveForm.reset();
  	});
  }


  getLeaveData() {
  	 this.userService.getOwnLeaveData({'employeeId':this.userData['employeeId']}).subscribe(res => {
  		this.leaveRequests=res;
  	});
  }

}
