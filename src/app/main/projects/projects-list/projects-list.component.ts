import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { StorageService } from '../../../shared/services/storage.service';
import {IProject, IProjectPreview, IProjectListResolved} from '../../../shared/interfaces/IProject';


@Component({
	selector: 'app-projects-list',
	templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {

	public projects: IProjectPreview[];

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public storage: StorageService,
	) { }

	ngOnInit() {
		const resolvedData: IProjectListResolved = this.route.snapshot.data['resolvedData'];
		this.projects = resolvedData.projects;
	}

	navToProjectDetails(project: IProject) {
		this.setActiveProject(project);
		this.router.navigate([`projects/${project.id}`]);
	}

	private setActiveProject(project) {
		this.storage.store('activeProject', {
			name: project.name,
			id: project.id
		});
	}

}
