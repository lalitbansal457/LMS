import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

	public userData:Object;
	public leaveRequests:any;

  constructor(public userService:UserService) {

  	if(localStorage.getItem('userData') != null) {
  		this.userData = JSON.parse(localStorage.getItem('userData'));
  	}

    var userType = this.userData['userType'] + '.id';
  	this.getLeaveData({[userType]: this.userData['employeeId']});
  }

  ngOnInit() {
  }


  getLeaveData(obj) {
  	this.userService.getEmpLeaveData(obj).subscribe(res => {
  		console.log(res);

  		this.leaveRequests = res;
  	})
  }

  updateLeaveStatus(leaveData,index, status) {
  	console.log(leaveData);

  	var leaveCount = this.calculateLeaveDays(leaveData);
  	console.log(leaveCount);

  	var requestObj:any = {};
  	requestObj._id = leaveData._id;
  	requestObj.employeeName = leaveData.employeeName;
  	requestObj.email = leaveData.email;
  	requestObj.leaveType = leaveData.leaveType;
  	requestObj.employeeId = leaveData.employeeId;
    requestObj.employeeEmail = leaveData.employeeEmail;
    requestObj.manager = leaveData.manager;
    requestObj.lead = leaveData.lead;
  	requestObj.hr = leaveData.hr;
  	requestObj.leaveCount = leaveCount;
  	requestObj.status = status;
    requestObj.userType = this.userData['userType'];

  	if(status == "approved") {
  		this.userService.updateLeaveStatus(requestObj).subscribe(res => {
  			console.log(this.leaveRequests);

  			if(res.ok) {
  				this.leaveRequests[index].status[requestObj.userType] = "approved";
  			}
  		})
  	} else {
  		this.userService.updateLeaveStatus(requestObj).subscribe(res => {
  			console.log(this.leaveRequests);

  			if(res.ok) {
  				this.leaveRequests[index].status[requestObj.userType] = "Denied";
  			}
  		})
  	}

  	
  }

  calculateLeaveDays(leaveData) {

  	// diff days will always return 1 days less as we need to add both from and to date;
  	
  	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  	var firstDate = new Date(leaveData.leaveFrom);
  	var secondDate = new Date(leaveData.leaveTo);
  	//console.log(firstDate, secondDate);

  	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

  	if(leaveData.fromFirstHalf) {
  		return 0.5;
  	} else if(leaveData.fromSecondHalf) {
  		if(diffDays == 0) {
  			if(leaveData.toFirstHalf) {
  				return 1;
  			}
  			return 0.5;
  		}

  		if(leaveData.toFirstHalf) {
  			return diffDays ;
  		}

  		return (diffDays + 0.5);
  	} else{
  		return (diffDays + 1);
  	}

  }
  


}
