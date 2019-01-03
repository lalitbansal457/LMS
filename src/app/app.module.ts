import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {Routes, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmployeeComponent } from './employee/employee.component';
import { DashboardComponent } from './employee/dashboard/dashboard.component';
import { ManagerComponent } from './manager/manager.component';

var appRoute:Routes = [
	{
		path: 'login', component: LoginComponent
	},
	{
		path: 'register', component: RegisterComponent
	},
  {
    path: 'dashboard', component: EmployeeComponent
  },
  {
    path: 'get-all-leaves', component: ManagerComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EmployeeComponent,
    DashboardComponent,
    ManagerComponent,
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoute, { useHash: true }), HttpClientModule, FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
