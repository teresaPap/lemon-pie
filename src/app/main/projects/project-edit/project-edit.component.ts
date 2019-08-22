import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { Router } from '@angular/router';
import { IFile } from '../../../shared/interfaces/IFile';


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
		public router: Router
	) { }

	ngOnInit() {
		this.file = this.storage.load('activeFile');
		console.log("Editing file: ", this.file);
	}


}
