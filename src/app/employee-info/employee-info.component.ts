import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import  {DataService} from '../services/data.service';
import  {UserService} from '../services/user.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit {
	message:string;
	employee:any = {};
	employeeId:string;

	public managerList:any = [];
	public leadList:any = [];
	public hrList:any = [];
  public userType:any = ['Team member', 'manager', 'lead', 'hr'];

  public editForm:FormGroup;

  constructor(public router:Router,public data:DataService, public userService:UserService, public route:ActivatedRoute) { 

  	var fields = {'employeeId': 1, 'name': 1, 'email': 1, '_id':0};

  	this.getUserData({'query':{'userType': 'manager'}, 'fields': fields}, 'manager');

  	this.getUserData({'query':{'userType': 'hr'}, 'fields': fields}, 'hr');

  	this.getUserData({'query':{'userType': 'lead'}, 'fields': fields}, 'lead');

  	this.employeeId = this.route.snapshot.paramMap.get('employeeId');

  	var queryObj = {
  		query: {'employeeId': this.employeeId},
  		fields: {}
  	}
     //this.cd.detectChanges();

  	this.userService.getUserData(queryObj).subscribe(res =>{
  		
  		this.employee = res[0];

      this.editForm = new FormGroup({
            'name' :new FormControl(this.employee.name, [
              Validators.required
            ]),
            'employeeId': new FormControl(this.employee.employeeId, [
              Validators.required
            ]),
            'email': new FormControl(this.employee.email, [
              Validators.required
            ]),
            'lead': new FormControl(this.employee.lead),
            'manager': new FormControl(this.employee.manager, [
              Validators.required
            ]),
            'hr': new FormControl(this.employee.hr, [
              Validators.required
            ]),
            'CL': new FormControl(this.employee.CL, [
              Validators.required
            ]),
            'SL': new FormControl(this.employee.SL, [
              Validators.required
            ]),
            'EL': new FormControl(this.employee.EL, [
              Validators.required
            ]),
            'userType': new FormControl(this.employee.userType, [
              Validators.required
             ])
      });
      
  	})

    
    this.editForm = new FormGroup({
      'name' :new FormControl(this.employee.name, [
        Validators.required
      ]),
      'employeeId': new FormControl(this.employee.employeeId, [
        Validators.required
      ]),
      'email': new FormControl(this.employee.email, [
        Validators.required
      ]),
      'lead': new FormControl(this.employee.lead),
      'manager': new FormControl(this.employee.manager, [
        Validators.required
      ]),
      'hr': new FormControl(this.employee.hr, [
        Validators.required
      ]),
      'CL': new FormControl(this.employee.CL, [
        Validators.required
      ]),
      'SL': new FormControl(this.employee.SL, [
        Validators.required
      ]),
      'EL': new FormControl(this.employee.EL, [
        Validators.required
      ]),
      'userType': new FormControl(this.employee.userType, [
        Validators.required
       ])
    })

    

  }

  ngOnInit() {
     //this.data.currentMessage.subscribe(message => this.message = message)
  }

  getUserData(obj, userType) {
    this.userService.getUserData(obj).subscribe(res =>{
      if(userType == 'manager') {
        
        this.managerList = res;
      } else if(userType == 'lead') {
        this.leadList = res;
      } else {
        this.hrList = res;
      }
    })
  }


  editControl() {
    console.log(this.editForm.value);
    this.userService.updateUser({updatedObj:this.editForm.value, 'dbCheck': this.employeeId}).subscribe(res=>{
      if(res.nModified) {
        this.employeeId = this.editForm.get('employeeId').value;
        this.router.navigate(['/list-employees'])
      }
    })
  }



}
