import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
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
		public router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.queryParamMap.subscribe(res => {
			this.file = this.storage.load(res.get('id'))
			console.log("Editing file: " , this.file );
		})
	}


}
