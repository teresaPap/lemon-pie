import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../shared/data-services/projects.service';

@Component({
	selector: 'app-project',
  	templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {

	public projectName: string;

   	constructor(
		public projectCtrl: ProjectsService
	) { }

   	ngOnInit(): void {
		this.projectCtrl.activeProjectChanges$.subscribe( res => this.projectName = res.name );
  	}

}
