import { Component } from '@angular/core';
import { DataService } from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nodeLearning1';
  message:string;

  constructor(private data: DataService) {

  }

  	ngOnInit() {
	  	//this.data.currentMessage.subscribe(message => this.message = message);
	}

}
