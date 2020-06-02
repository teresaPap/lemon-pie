import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage.service';
import { FirebaseApiService } from '../../../core/services/firebase-api.service';
import { IProject, IProjectPreview, IProjectListResolved } from '../../../shared/interfaces/IProject';


@Component({
	selector: 'app-projects-list',
	templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {

	public projects: IProjectPreview[];

	constructor(
		private route: ActivatedRoute,
		private apiService: FirebaseApiService,
		public router: Router,
		public storage: StorageService,
	) { }

	ngOnInit() {
		const resolvedData: IProjectListResolved = this.route.snapshot.data['resolvedData'];
		this.projects = resolvedData.projects;

		this.getProjectPreviewImage(resolvedData.projects);
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

	private getProjectPreviewImage(projects: IProjectPreview[]): void {

		// TODO: convert this function to return type Observable<IProjectPreview[]> and move it to projects-list-resolver, to enhance ux
		projects.map( (project, index) => {
			if (project.references?.length) {
				// @ts-ignore
				this.apiService.readDocument(project.references[0].path).subscribe(
					res => this.projects[index].previewImage = res.base64
				);
			} else {
				this.projects[index].previewImage = 'https://www.jobbnorge.no/search/img/no-hits.png';
			}
		});
	}

}
