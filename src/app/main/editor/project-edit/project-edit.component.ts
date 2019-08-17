import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IFile } from '../../../shared/interfaces/IFile';


// PAGE DESCRIPTION: 
// In this view the user can select a file and open the file editor view. 


@Component({
	selector: 'app-project-edit',
	templateUrl: './project-edit.component.html'
})
export class ProjectEditComponent implements AfterViewInit {

	public file: IFile;

	@ViewChild('canvas', { static: false }) public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private editor;

	constructor(
		public storage: StorageService,
		public router: Router,
		private route: ActivatedRoute
	) { }

	// ngOnInit() {
	ngAfterViewInit() {
		// get the context
		const editor: HTMLCanvasElement = this.canvas.nativeElement;
		this.cx = editor.getContext('2d');
		
		
		// set some default properties about the line
		this.cx.lineWidth = 3;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#555555';


		this.route.queryParamMap.subscribe(res => {
			this.file = this.storage.load(res.get('id'))
			console.log(res.get('id'), this.file);
			// set the width and height
			this.setSize(this.file.downloadURL)
			this.setBackground(this.file.downloadURL)
		})
	}

	// #region - Canvas Manipulation Functions

	private setSize(url) {

		const img = new Image();
		img.addEventListener("load", () =>  {
			// this.editor.width = img.naturalWidth; 
			// this.editor.height = img.naturalHeight;
		});
		img.src = url;
	}

	private setBackground(url: string) {
		// create img element
		const img = new Image();
		img.src = url;

		//set this img as a canvas background
		this.cx.drawImage(img, 0, 0);
	}




	// #endregion


	// var canvas = document.getElementById("canvas");
	// var ctx = canvas.getContext("2d");
	// ctx.fillStyle = "blue";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

}
