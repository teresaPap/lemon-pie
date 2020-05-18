import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { NotifierService } from 'angular-notifier';

import { StorageService } from '../../../shared/services/storage.service';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import { FilesService } from '../../../shared/data-services/files.service';

import { IProject } from '../../../shared/interfaces/IProject';
import { IFile } from '../../../shared/interfaces/IFile';

// PAGE DESCRIPTION:
// In this view the user can add files to the current project
// and inspect project status (name, description etc)
// if the current project is not yet created (  -> projectId == 0 ), here the user can create a new project.

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

	public project: IProject = {} as IProject;
	public files: IFile[] = [];
	public filesToUpload: File[] = [];

	public projectDetailForm: FormGroup;
	public deleteProjectForm: FormGroup;

	private deleteAction: Subscription = new Subscription;


	constructor(
		public storage: StorageService,
		public router: Router,
		private route: ActivatedRoute,
		private fileCtrl: FilesService,
		private projectCtrl: ProjectsService,
		private fb: FormBuilder,
		private notifier: NotifierService
	) { }

	ngOnInit() {
		this.projectDetailForm = this.fb.group({
			name: ['', Validators.required],
			description: ''
		});

		this.deleteProjectForm = this.fb.group({
			confirmDelete: ['', Validators.pattern('I want to delete my account')]
		});

		this.project = this.storage.load('activeProject');

		this.route.params.pipe(
			switchMap(params => {
				const dataToGet: [Observable<any>, Observable<IFile[]>?] = [this.projectCtrl.readSingle(params.id)];
				if (params.id !== '0') {
					this.project.id = params.id;
					dataToGet.push(this.readFiles(params.id));
				} else {
					this.project.id = '';
				}
				return forkJoin(dataToGet);
			}),
			tap(res => {
				this.project = { ...this.project, ...res[0].data() };
				this.initializeForm(this.project.name, this.project.description);
				if (res[1]) {
					this.files = res[1];
					this.project.files = this.files;

					this.storage.store('storedFiles' , this.project.files.map( el => {
						const { displayName, downloadURL, id, name, path } = el;
						return { displayName, downloadURL, id, name, path };
					}));
				}
			})
		).subscribe();
	}

	ngOnDestroy() {
		this.deleteAction.unsubscribe();
	}

	public saveProjectDetailForm() {
		if (this.projectDetailForm.valid) {
			console.log('TODO: save Project Detail Form', this.projectDetailForm.value);
		}
	}

	public navToEdit() {
		const storedFiles = this.storage.load('storedFiles');
		this.storage.store('activeFile', storedFiles[0]);
		this.router.navigate([`projects/${this.project.id}/edit`], { queryParams: { id: storedFiles[0].id } });
	}

	public navToPlay() {
		this.router.navigate(['present']);
		this.notifier.notify('info', 'TODO: nav to play');
	}

	public delete(file: IFile) {
		// always unsubscribe at start
		// TODO: Is this a good practice?
		this.deleteAction.unsubscribe();

		this.deleteAction = this.fileCtrl.delete(file.id, file.name, this.project.id).subscribe(
			res => {
				this.notifier.notify('default', `File "${file.name}" was deleted successfully`);
				this.files = this.files.filter(elem => elem.id !== file.id);
			},
			err => {
				this.notifier.notify('error', `An error occured while deleting file "${file.name}"`);
				console.warn('DELETE FAILED: ', err);
			}
		);
	}

	public uploadFiles(fileList: FileList) {
		console.log('files to upload', fileList, fileList.length, fileList.item(1) );

		for (let i = 0 ; i < fileList.length ; i++ ) {
			this.filesToUpload.push(fileList.item(i));

			console.log(fileList.item(i));

			this.fileCtrl.create( fileList.item(i), this.project.id ).subscribe(
				res => console.log(res),
				err => console.log(err) ,
				() => {
					console.log('FILE CREATE COMPLETED');
					this.notifier.notify('success', `File was uploaded successfully`);
					this.filesToUpload.pop();

				}
			);
		}
	}


	public saveFile(file: IFile) {
		console.log('TODO: implement save');
	}

	public submitDeleteProjectForm() {
		return;
	}

	private readFiles(projectId: string) {
		return this.fileCtrl.read(projectId);
	}

	private initializeForm(name: string, description: string): void {
		this.projectDetailForm.controls['name'].setValue(name);
		this.projectDetailForm.controls['description'].setValue(description);
	}

}
