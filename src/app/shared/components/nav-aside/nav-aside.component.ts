import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-nav-aside',
	templateUrl: './nav-aside.component.html',
	styleUrls: ['./nav-aside.component.scss']
})
export class NavAsideComponent implements OnInit {

	public collapseBtnText: 'Expand' | 'Collapse';

	constructor() { }

	ngOnInit() {
	}

}

