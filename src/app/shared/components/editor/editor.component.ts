import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { switchMap, takeUntil, pairwise, tap } from 'rxjs/operators';

interface ICanvasPosition {
	x: number;
	y: number;
}
@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit, OnInit, OnDestroy {

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

		// set up the canvas 
		this.setBackground(this.imgUrl);
		this.setStrokeStyle(); // TODO: BUG - this doesn't work here. It would work inside drawRectangle() 

		// Start watching for canvas events
		this.captureEvents();
	}

	ngOnDestroy(): void {
		// TODO: unsubscribe ??
	}

	
	// #region - Canvas events handling - see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private captureEvents() {

		const mousedown$ = fromEvent(this.editor, 'mousedown');
		const mouseup$ = fromEvent(this.editor, 'mouseup');
		const mousemove$ = fromEvent(this.editor, 'mousemove');
		const mouseleave$ = fromEvent(this.editor, 'mouseleave');

		mousedown$.pipe(
			switchMap(() => {
				return mousemove$.pipe(
					takeUntil(mouseup$),
					takeUntil(mouseleave$)
				);
			}),
			// use pairwise to form the response like "[prev,current] position" 
			pairwise()
		).subscribe((res: [MouseEvent, MouseEvent]) => {
			const rect = this.editor.getBoundingClientRect();

			console.log(res, rect);
			// previous and current position with the offset
			const prevPos: ICanvasPosition = {
				x: res[0].clientX - rect.left,
				y: res[0].clientY - rect.top
			};

			const currentPos: ICanvasPosition = {
				x: res[1].clientX - rect.left,
				y: res[1].clientY - rect.top
			};
			this.drawRectangle(prevPos, currentPos)
		})
	}

	private drawRectangle(prevPos: ICanvasPosition, currentPos: ICanvasPosition) {
		// console.log('prevPos', prevPos, '\ncurrentPos', currentPos);

		// incase the context is not set	
		if (!this.cx) { return; }


		this.cx.rect(prevPos.x, prevPos.y, currentPos.x, currentPos.y);
		this.cx.stroke();
	}


	private setBackground(url): Subscription {
		const img = new Image();
		img.src = url;
		// read img
		return fromEvent(img, 'load').subscribe(
			() => {
				// resize canvas to the image size
				this.editor.height = img.naturalHeight;
				this.editor.width = img.naturalWidth;
				// display the image
				this.cx.drawImage(img, 0, 0);
			});
	}

	private setStrokeStyle() {
		// TODO: maybe create a panel for user to set the style
		this.cx.lineWidth = 30;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#ff0808';

		console.log('stroke style is set.');
	}

	// #endregion


}
