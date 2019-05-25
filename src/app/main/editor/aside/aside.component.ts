import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-aside',
	templateUrl: './aside.component.html',
	styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {

	public expandMenu: boolean;

	constructor() { }

	ngOnInit() {
	}

	public toggleAsideMenu() {
		this.expandMenu = !this.expandMenu;
	}

}

