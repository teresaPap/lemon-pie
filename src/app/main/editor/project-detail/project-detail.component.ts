import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../shared/data-services/files.service';

// PAGE DESCRIPTION: 
// In this view the user can add files to the current project
// and inspect project status (name, description etc)

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {

	public files: any[] = [];

	constructor(
		private route: ActivatedRoute,
		private fileCtrl: FilesService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			console.log("Edidting project with id: " + params.id );
			if ( params.id!='0' ) this.getFiles(params.id);
		})
	}

	private getFiles(projectId:string) {
		this.fileCtrl.read(projectId).subscribe(
			files => {
			console.log("Files: ", files);
			this.files = files;
			}, 
			error => {
				console.log(error)
		})
	}


}
