import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from '../../../shared/data-services/files.service';
import { IProject } from '../../../shared/interfaces/IProject';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { IFile } from '../../../shared/interfaces/IFile';
import { StorageService } from '../../../shared/services/storage.service';

// PAGE DESCRIPTION: 
// In this view the user can add files to the current project
// and inspect project status (name, description etc)

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {

	public project: IProject = {} as IProject;
	public files: IFile[] = [];

	constructor(
		public storage: StorageService,
		public router: Router, 
		private route: ActivatedRoute,
		private fileCtrl: FilesService,
		private projectCtrl: ProjectsService,
	) { }

	ngOnInit() {
		this.route.params.pipe(
			switchMap( params => {
				let dataToGet: [ Observable<any>, Observable<IFile[]>? ] = [ this.projectCtrl.readSingle(params.id)];
				if ( params.id!='0' ) {
					this.project.id = params.id;
					dataToGet.push(this.getFiles(params.id));
				}
				return forkJoin(dataToGet);
			}),
			tap( res => {
				this.project = { ...this.project , ...res[0].data() };
				console.log("Editing project: " , this.project );
				if (res[1]) this.files = res[1];
			})
		).subscribe();
	}

	public navToEdit(file: IFile) {
		this.storage.store( file.id , file);
		// this.router.navigate( ['/edit1'], {relativeTo: this.route} ); //, { queryParams: [ {fileId: file.id} ] ,  );
	}

	
	private getFiles(projectId: string) {
		return this.fileCtrl.read(projectId);
	}


}
