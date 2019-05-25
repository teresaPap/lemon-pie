import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav-top',
	templateUrl: './nav-top.component.html',
	styleUrls: ['./nav-top.component.scss']
})
export class NavTopComponent implements OnInit {

	public username: string;

	constructor() { }

	ngOnInit() {
		// TODO: get user info from auth service and set username variable
	}

}
