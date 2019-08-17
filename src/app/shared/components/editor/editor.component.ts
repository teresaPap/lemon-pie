import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

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
		console.log('Editor Ready \nUrl: ' + this.imgUrl);
	}

	ngAfterViewInit(): void {
		// get the context
		this.editor = this.canvas.nativeElement;
		this.cx = this.editor.getContext('2d');

		this.setBackground(this.imgUrl);


		// #region - https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415
		// set some default properties about the line
		this.cx.lineWidth = 3;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#000';

		// we'll implement this method to start capturing mouse events
		this.captureEvents();
		// #endregion

	}

	// #region - https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private captureEvents() {
		const canvasEl = this.editor;
		// this will capture all mousedown events from the canvas element
		fromEvent(canvasEl, 'mousedown')
			.pipe(
				switchMap((e) => {
					// after a mouse down, we'll record all mouse moves
					return fromEvent(canvasEl, 'mousemove')
						.pipe(
							// we'll stop (and unsubscribe) once the user releases the mouse
							// this will trigger a 'mouseup' event    
							takeUntil(fromEvent(canvasEl, 'mouseup')),
							// we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
							takeUntil(fromEvent(canvasEl, 'mouseleave')),
							// pairwise lets us get the previous value to draw a line from
							// the previous point to the current point    
							pairwise()
						)
				})
			)
			.subscribe((res: [MouseEvent, MouseEvent]) => {
				const rect = canvasEl.getBoundingClientRect();

				// previous and current position with the offset
				const prevPos = {
					x: res[0].clientX - rect.left,
					y: res[0].clientY - rect.top
				};

				const currentPos = {
					x: res[1].clientX - rect.left,
					y: res[1].clientY - rect.top
				};

				// this method we'll implement soon to do the actual drawing
				this.drawOnCanvas(prevPos, currentPos);
			});
	}

	private drawOnCanvas(
		prevPos: { x: number, y: number },
		currentPos: { x: number, y: number }
	) {
		// incase the context is not set
		if (!this.cx) { return; }

		// start our drawing path
		this.cx.beginPath();

		// we're drawing lines so we need a previous position
		if (prevPos) {
			// sets the start point
			this.cx.moveTo(prevPos.x, prevPos.y); // from

			// draws a line from the start pos until the current position
			this.cx.lineTo(currentPos.x, currentPos.y);

			// strokes the current path with the styles we set earlier
			this.cx.stroke();
		}
	}

	// #endregion

	private setBackground(url): void {
		const img = new Image();
		img.src = url;
		// read img
		img.addEventListener('load', () => {
			// resize canvas to the image size
			this.editor.height = img.naturalHeight;
			this.editor.width = img.naturalWidth;
			// display the image
			this.cx.drawImage(img, 0, 0);
		});
	}

}
