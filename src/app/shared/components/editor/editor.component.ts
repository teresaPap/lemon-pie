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
	private editor: HTMLCanvasElement;

	constructor() { }

	ngOnInit(): void {
		console.log('Editor Ready \nUrl: '+ this.imgUrl );
	}

	ngAfterViewInit(): void {
		// get the context
		this.editor = this.canvas.nativeElement;
		this.cx = this.editor.getContext('2d');
		
		this.setBackground(this.imgUrl);	
	}

	private setBackground(url): void {
		const img = new Image();
		img.src = url;
		// read img
		img.addEventListener('load', () =>  {
			// resize canvas to the image size
			this.editor.height = img.naturalHeight;
			this.editor.width = img.naturalWidth;
			// display the image
			this.cx.drawImage(img, 0, 0);
		});	
	}

}
