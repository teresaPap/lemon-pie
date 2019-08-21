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

	@ViewChild('canvasBg', { static: false }) public canvasBg: ElementRef; 
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
		this.monitorEvents();
	}

	ngOnDestroy(): void {
		// TODO: unsubscribe ??
	}

	
	// #region - Canvas events handling - see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private monitorEvents() {

		const onMouseDown$ = fromEvent(this.editor, 'mousedown');
		const onMouseUp$ = fromEvent(this.editor, 'mouseup');
		const onMouseMove$ = fromEvent(this.editor, 'mousemove');
		const onMouseLeave$ = fromEvent(this.editor, 'mouseleave');
	
		let startingPos: ICanvasPosition;

		onMouseDown$.pipe(
			tap( (mouseDown: MouseEvent) => {
				startingPos = this.getPositionOnCanvas(mouseDown);
			}),
			switchMap( () => 
				onMouseMove$.pipe(
					takeUntil(onMouseUp$),
					takeUntil(onMouseLeave$),
				)
			),
			map( (res:MouseEvent) => this.getPositionOnCanvas(res) ),
			tap( () => this.clearCanvas() )
		).subscribe( currentPos  => {
			this.drawSelection(startingPos, currentPos);
		})
	}

	private clearCanvas() {
		this.cx.clearRect(0, 0, this.editor.width, this.editor.height);
	}

	private drawSelection( startingPos, currentPos ) {
		// TODO: every time you draw a new selection, delete the previous drawing, so that the selection does not have this silly gradient.
		if (!this.cx) return;

		const width: number = currentPos.x - startingPos.x ;
		const height: number = currentPos.y - startingPos.y ;

		this.cx.fillStyle = "#fe812d50";
		this.cx.fillRect(startingPos.x, startingPos.y, width, height );
	}

	private captureEvents() {

		const onMouseDown$ = fromEvent(this.editor, 'mousedown');
		const onMouseUp$ = fromEvent(this.editor, 'mouseup');
		const onMouseMove$ = fromEvent(this.editor, 'mousemove');
		const onMouseLeave$ = fromEvent(this.editor, 'mouseleave');

		onMouseDown$.pipe(
			map( (mouseDown: MouseEvent) => this.getPositionOnCanvas(mouseDown) ),
			switchMap( (startingPos: ICanvasPosition) => {
				const selectionStoped$ =  onMouseMove$.pipe(
					takeUntil(onMouseUp$),
					takeUntil(onMouseLeave$)
				);
				return forkJoin( of(startingPos), selectionStoped$ );
			}),
			map( ( res: [ICanvasPosition, MouseEvent] )  => {
				const finalPos = this.getPositionOnCanvas( res[1] )
				return [ res[0], finalPos];
			}),
			tap( res => console.log('capture events ONCE: ' , res) )
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


		// BUG: offset when painting on canvas 
		// occures if the canvas is resided to fit the screen (this happends automatically)
		// TODO: use css to display image real size and add scroll bars horizontally and vertically
		// Otherwise, for responsiveness,  give the canvas the size of the image as it appears on the screen (swich img.naturalHeight with sth ele, if applicable)

	}


	private setBackground(url): Subscription {
		const img = this.canvasBg.nativeElement;

		img.src = url;

		// read img
		return fromEvent(img, 'load').subscribe(
			() => {
				// size canvas to the image size
				console.log(`Image size: ${img.naturalWidth} x ${img.naturalHeight}`);
				

				this.editor.height = img.naturalHeight;
				this.editor.width = img.naturalWidth;
				// display the image
				// this.cx.drawImage(img, 0, 0);
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
