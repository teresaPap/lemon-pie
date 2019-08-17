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
		
		// set some default properties about the line
		this.cx.lineWidth = 3;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#555555';

		// set the width and height
		// TODO: Refactor!
		this.setSize(this.imgUrl).then(
			res => {
				console.log('res' , res);
			}
		);		

	}

	private async setSize(url) {

		const img = new Image();
		img.src = url;
		return await img.addEventListener('load', (e) =>  {
			console.log('image size: ' + img.naturalHeight +'x'+ img.naturalWidth);

			this.editor.height = img.naturalHeight;
			this.editor.width = img.naturalWidth;
		
			this.setBackground(this.imgUrl);
		});
		
		
	}

	private setBackground(url: string) {
		// create img element
		const img = new Image();
		img.src = url;

		//set this img as a canvas background
		this.cx.drawImage(img, 0, 0);
	}



}
