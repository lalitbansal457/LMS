import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import  {UserService} from '../services/user.service';
import  {DataService} from '../services/data.service';


@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

	public employeeList = [];
	message:string;

  constructor(public userService:UserService, private router:Router, public data:DataService) { 
  	
  	this.userService.listEmployees().subscribe(res => {
  		console.log(res);
  		this.employeeList = res;
  	})

  }

  ngOnInit() {
    //this.data.currentMessage.subscribe(message => this.message = message)
  }


  	employeeInfo(employeeId) {
  		//this.data.changeMessage("employee");
  		this.router.navigate(['/list-employees', employeeId])
  	}






}
