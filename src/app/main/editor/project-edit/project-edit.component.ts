import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IFile } from '../../../shared/interfaces/IFile';


// PAGE DESCRIPTION: 
// In this view the user can select a file and open the file editor view. 


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements OnInit {

	// @ViewChild('editor') editor: ElementRef ; 

	public file: IFile;

	constructor( 
		public storage: StorageService,
		public router: Router,
		private route: ActivatedRoute
		) { }

	ngOnInit() {
		this.route.queryParamMap.subscribe(res => {
			this.file = this.storage.load( res.get('id') )
			console.log(res.get('id'), this.file );
			this.setBackground(this.file.downloadURL)
		})
	}

	// #region - Canvas Manipulation Functions

	private setBackground(url:string) {
		
		// const ctx = this.editor.getContext('2d');
		// ctx.setBackground(url);
	}



	// #endregion


	// var canvas = document.getElementById("canvas");
	// var ctx = canvas.getContext("2d");
	// ctx.fillStyle = "blue";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

}
