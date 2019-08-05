import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { IProject } from '../../../shared/interfaces/IProject';
import { switchMap, tap } from 'rxjs/operators';
import { FilesService } from '../../../shared/data-services/files.service';
import { of } from 'rxjs/internal/observable/of';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-project-list',
	templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {

	public projects: IProject[];
	public showCreateForm: boolean = false;

	constructor( 
		private projectCtlr: ProjectsService ) { }

	ngOnInit() {
		this.projectCtlr.read().subscribe( projects => {
				this.projects = projects; 
				console.log(projects);
				for ( let p of projects ) {
					if (p.preview) p.preview.subscribe( res => p.previewSrc = `url(${res.downloadURL})` );
					else p.previewSrc = "url('https://www.jobbnorge.no/search/img/no-hits.png')";
				}				
		});
	}

	public toggleCreateProjectForm(isVisible: boolean) {
		this.showCreateForm = isVisible;
	}
	

}
