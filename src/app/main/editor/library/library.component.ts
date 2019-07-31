import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

	public projects;

	constructor() { }

	ngOnInit() {
		// this.projectCtlr.read().subscribe(
		// 	projects => this.projects = projects
		// );
		}

	


}
