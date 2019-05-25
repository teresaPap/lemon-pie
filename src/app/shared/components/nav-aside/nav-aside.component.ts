import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav-aside',
	templateUrl: './nav-aside.component.html',
	styleUrls: ['./nav-aside.component.scss']
})
export class NavAsideComponent implements OnInit {

	public collapseBtnText: 'Expand' | 'Collapse';

	public collapseMenu: boolean;

	public collapseBtnClass: 'fa-angle-double-right' | 'fa-angle-double-left';

	constructor() { }

	ngOnInit() {
		this.collapseBtnText = 'Expand';
		this.collapseMenu = true;
	}

	public toggleAsideMenu() {
		console.log('collapseMenu:' +this.collapseMenu);
		this.collapseMenu = !this.collapseMenu;
	}

}

