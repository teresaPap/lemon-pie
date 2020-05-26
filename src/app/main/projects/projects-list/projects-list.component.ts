import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { StorageService } from '../../../shared/services/storage.service';
import { IProject, IProjectPreview } from '../../../shared/interfaces/IProject';


@Component({
	selector: 'app-projects-list',
	templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {

	public projects: IProjectPreview[];
	public showCreateForm = false;

	constructor(
		public router: Router,
		public storage: StorageService,
		private projectCtlr: ProjectsService ) { }

	ngOnInit() {
		this.projectCtlr.readAllProjectsForActiveUser().subscribe(
			projects => {
				this.populateProjects(projects);
			}, error => {
				console.log(error);
			});
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
