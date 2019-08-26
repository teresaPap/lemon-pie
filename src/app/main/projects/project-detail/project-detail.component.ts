import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from '../../../shared/data-services/files.service';
import { IProject } from '../../../shared/interfaces/IProject';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { IFile } from '../../../shared/interfaces/IFile';
import { StorageService } from '../../../shared/services/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

	public projectDetailForm: FormGroup;

	constructor(
		public storage: StorageService,
		public router: Router, 
		private route: ActivatedRoute,
		private fileCtrl: FilesService,
		private projectCtrl: ProjectsService,
		private fb: FormBuilder
	) { }

	ngOnInit() {

		this.projectDetailForm = this.fb.group({
			name: [ '', Validators.required],
			description: ''
		});

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
				this.initializeForm(this.project.name , this.project.description);
				console.log("Editing project: " , this.project );
				if (res[1]) this.files = res[1];
				console.log(this.files);
			})
		).subscribe();
	}

	public savePojectDetailForm() {
		if (this.projectDetailForm.valid) 
			console.log(this.projectDetailForm.value);
	}

	public navToEdit(file: IFile) {
		this.storage.store( file.id , file);
		// this.router.navigate( ['/edit1'], {relativeTo: this.route} ); //, { queryParams: [ {fileId: file.id} ] ,  );
	}

	public delete(file) {
		this.fileCtrl.delete(file.id, file.name, this.project.id )
	}

	
	private getFiles(projectId: string) {
		return this.fileCtrl.read(projectId);
	}

	private initializeForm( name: string, description: string ): void {
		this.projectDetailForm.controls['name'].setValue(name);
		this.projectDetailForm.controls['description'].setValue(description);
	}

}

