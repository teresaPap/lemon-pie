import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IFile } from '../../../shared/interfaces/IFile';
import { FilesService } from '../../../shared/data-services/files.service';
import { map, switchMap, tap } from 'rxjs/operators';


// PAGE DESCRIPTION: 
// In this view the user can see the file editor view and edit panel (buttons etc). 


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

	public fileUrl: string;
	public links = [];
	public showLinks: boolean = false;

	constructor(
		public storage: StorageService,
		public router: Router, 
		private route: ActivatedRoute,
		public filesCtrl: FilesService
	) { }

	ngOnInit() {
		this.fileUrl = this.storage.load('activeFileUrl');

		this.route.params.pipe(
			map( params => params['id'] ),
			switchMap( fileId => this.filesCtrl.getFileLinks(fileId) ),
			tap( res => this.links = res )
		 );
	}


	public saveArea(event): void {
		this.filesCtrl.saveFileLink(event).subscribe(
			() => console.log('TODO: show user friendly success message'), 
			err => console.log('TODO: show user friendly failure message')
		);
	}

	public onShowLinks(event): void {
		this.showLinks = event;
	}
	
}
