import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav-aside',
	templateUrl: './nav-aside.component.html',
	styleUrls: ['./nav-aside.component.scss']
})
export class NavAsideComponent implements OnInit {

	public expandMenu: boolean;

	constructor() { }

	ngOnInit() {
	}

	public toggleAsideMenu() {
		this.expandMenu = !this.expandMenu;
	}

}

