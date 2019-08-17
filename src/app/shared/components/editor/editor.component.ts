import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit, OnInit {
	

	@Input() imgUrl: string;
	
	@ViewChild('canvas', { static: false }) public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private editor;

	constructor() { }

	ngOnInit(): void {
		console.log('Editor Ready \nUrl: '+ this.imgUrl );
	}

	ngAfterViewInit(): void {

		// get the context
		const editor: HTMLCanvasElement = this.canvas.nativeElement;
		this.cx = editor.getContext('2d');
		
		
		// set some default properties about the line
		this.cx.lineWidth = 3;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#555555';

		// set the width and height
		this.setSize(this.imgUrl)
		this.setBackground(this.imgUrl)
	}

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



}
