import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../shared/data-services/projects.service';

@Component({
	selector: 'app-project-list',
	templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {

	public projects;
	public showCreateForm: boolean = false;

	constructor( private projectCtlr: ProjectsService ) { }

	ngOnInit() {
		this.projectCtlr.read().subscribe(
			projects => this.projects = projects
		);
	}

	public toggleCreateProjectForm(isVisible: boolean) {
		this.showCreateForm = isVisible;
	}
	


}
