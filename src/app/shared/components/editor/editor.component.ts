import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription, forkJoin, of } from 'rxjs';
import { switchMap, takeUntil, pairwise, tap, map } from 'rxjs/operators';

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
			map( (mouseDownEvent:MouseEvent) => this.getPositionOnCanvas(mouseDownEvent) ),
			switchMap( (startingPos: ICanvasPosition) => {

				const watcher =  mousemove$.pipe(
					takeUntil(mouseup$),
					takeUntil(mouseleave$)
				);
				
				return forkJoin( of(startingPos), watcher )
			}),
			map( (res: [ICanvasPosition, MouseEvent])  => {
				const ev2 = this.getPositionOnCanvas( res[1] )
				return [res[0], ev2];
			}),
			// use pairwise to form the response like "[prev,current] position" 
			tap( res => console.log('capture events res' , res) ),
			// map( (res: [ICanvasPosition, [MouseEvent, MouseEvent]] ) => {

			// 	const watcher = res[1];
			// 	const a = this.getPositionOnCanvas( watcher[0] );
			// 	const b = this.getPositionOnCanvas( watcher[1] );
			// 	return res;
			// })
		).subscribe( res  => {

			const startingPos = res[0];
			const finalPos = res[1]
			
			
			
			this.drawRectangle(startingPos, finalPos)
		})
	}

	private drawRectangle( startingPos: ICanvasPosition, finalPos: ICanvasPosition ) {
		// incase the context is not set	
		if (!this.cx) return;

		const width: number = finalPos.x - startingPos.x ;
		const height: number = finalPos.y - startingPos.y ;

		this.cx.rect(startingPos.x, startingPos.y, width, height );
		this.cx.stroke();



		// BUG: offset when painting on canvas occures when the canvas is resided to fit the screen (this happend automatically)
		// TODO: use css to display image real size and add scroll bars horizontally and vertically

	}


	private setBackground(url): Subscription {
		const img = new Image();
		img.src = url;
		// read img
		return fromEvent(img, 'load').subscribe(
			() => {
				// resize canvas to the image size
				console.log(`Image size: ${img.naturalWidth} x ${img.naturalHeight}`);
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

	private getPositionOnCanvas(e: MouseEvent): ICanvasPosition {
		const rect = this.editor.getBoundingClientRect();
		const position: ICanvasPosition = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
		return position;
	}

	// #endregion


	

}
