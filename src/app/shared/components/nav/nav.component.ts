import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public username: string;

	constructor() { }

	ngOnInit() {
		// TODO: get user info from auth service and set username variable
	}

}
