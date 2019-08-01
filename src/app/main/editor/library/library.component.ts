import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../shared/data-services/projects.service';

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

	public projects;
	public showCreateForm: boolean = false;

	constructor( private projectCtlr: ProjectsService ) { }

	ngOnInit() {
		this.projectCtlr.read().subscribe(
			projects => this.projects = projects
		);
	}

	public createProject() {
		this.showCreateForm = true;
	}
	


}
