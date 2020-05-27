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
	public showCreateForm = false;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public storage: StorageService,
	) { }

	ngOnInit() {
		const resolvedData: IProjectListResolved = this.route.snapshot.data['resolvedData'];
		console.log(resolvedData);
		this.populateProjects(resolvedData.projects);
	}

	navToProjectDetails(project: IProject) {
		this.setActiveProject(project);
		this.router.navigate([`projects/${project.id}`]);
		// this.router.navigate([`projects/lalala`]);
	}

	public toggleCreateProjectForm(isVisible: boolean) {
		this.showCreateForm = isVisible;
	}

	private setActiveProject(project) {
		this.storage.store('activeProject', {
			name: project.name,
			id: project.id
		});
	}

	private populateProjects(projects): void {
		this.projects = projects;
		for ( const p of projects ) {
			if (p.preview) {
				p.preview.subscribe( res => p.previewSrc = `url(${res.downloadURL})` );
			} else {
				p.previewSrc = 'url("https://www.jobbnorge.no/search/img/no-hits.png")';
			}
		}
	}
}
