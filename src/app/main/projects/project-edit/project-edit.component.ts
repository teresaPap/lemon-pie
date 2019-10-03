import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { Router } from '@angular/router';
import { IFile } from '../../../shared/interfaces/IFile';
import { FilesService } from '../../../shared/data-services/files.service';


// PAGE DESCRIPTION: 
// In this view the user can see the file editor view and edit panel (buttons etc). 


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

	public file: IFile;

	constructor(
		public storage: StorageService,
		public router: Router, 
		public filesCtrl: FilesService
	) { }

	ngOnInit() {
		this.file = this.storage.load('activeFile');
		console.log("Editing file: ", this.file);
	}


	public saveArea(event): void {
		this.filesCtrl.saveFileLink(event).subscribe(
			() => console.log('TODO: show user friendly success message'), 
			err => console.log('TODO: show user friendly failure message')
		);
	}

	public onShowLinks(event): void {
		console.log('show links event', event, this.file)

		this.filesCtrl.getFileLinks(this.file.id).subscribe(
			res => {
				console.log(res)
				// TODO: Draw a rectangle for each of the clickable areas using the linker component. 
			}
		);
	}
	
}
