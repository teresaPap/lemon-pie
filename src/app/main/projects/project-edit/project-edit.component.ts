import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../shared/services/storage.service';
import { FilesService } from '../../../shared/data-services/files.service';
import { IFile } from '../../../shared/interfaces/IFile';


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

	public file: IFile;

	public links = [];
	public showLinks = false;

	constructor(
		public storage: StorageService,
		public router: Router,
		public filesCtrl: FilesService,
		private notifier: NotifierService
	) { }

	ngOnInit() {
		this.setActiveFile(this.storage.load('activeFile'));
	}

	public saveSingleChangeLocally(event): void {

		console.log(event);

		// this.filesCtrl.saveFileLink(event).subscribe(
		// 	() => {
		// 		this.notifier.notify('success', 'Link was saved successfully!');
		// 	},
		// 	err => {
		// 		console.log('TODO: show user friendly failure message');
		// 		this.notifier.notify('error', `${err.message}`);
		// 	}
		// );
	}


	public onShowLinks(event): void {
		this.showLinks = event;
	}

	public onSaveAllChanges(): void {
		// TODO: use firebase data services to update links, files and project according to the data stored in storage service.
	}

	public onChangeActiveFile(file): void {
		this.setActiveFile(file);
	}

	private setActiveFile(file: IFile) {
		console.log('hey');
		this.file = file;


		this.filesCtrl.getFileLinks(this.file.id).subscribe(
			res => this.links = res
		);
	}

}
