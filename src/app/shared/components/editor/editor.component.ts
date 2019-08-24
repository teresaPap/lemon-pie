import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subscription, forkJoin, of } from 'rxjs';
import { switchMap, takeUntil, tap, map } from 'rxjs/operators';
import { IClickableArea, ICanvasPosition } from '../../interfaces/IClickableArea';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements AfterViewInit, OnInit, OnDestroy {

	@Input() imgUrl: string;
	@Output('saveArea') saveArea: EventEmitter<IClickableArea> = new EventEmitter<IClickableArea>();


	@ViewChild('canvasBg', { static: false }) public canvasBg: ElementRef;
	@ViewChild('canvas', { static: false }) public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private editor: HTMLCanvasElement;

	public showSelectionMenu: boolean;
	private canvasSelection: IClickableArea;

	constructor() { }

	ngOnInit(): void {
		console.log('Editor Ready' );
	}

	ngAfterViewInit(): void {
		// get the context
		this.editor = this.canvas.nativeElement;
		this.cx = this.editor.getContext('2d');

		// set up the canvas 
		this.setBackground(this.imgUrl);

		// Start watching for canvas events
		this.watchCanvasEvents();
	}

	ngOnDestroy(): void {
		// TODO: unsubscribe ??
	}

	public saveLink(selectedFileId: string):void {
		this.clearCanvas();
		this.canvasSelection.link = selectedFileId;
		console.log('Selection saved: ', this.canvasSelection);
		this.saveArea.emit(this.canvasSelection);
		this.showSelectionMenu = false;
	}

	public closeSelectionMenu():void {
		this.clearCanvas();
		this.canvasSelection.link = null;
		console.log('Selection canceled.');
		this.showSelectionMenu = false;
	}

	// #region - Canvas events handling - see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private watchCanvasEvents() {
		const $onMouseDown = fromEvent(this.editor, 'mousedown');
		const $onMouseUp = fromEvent(this.editor, 'mouseup');
		const $onMouseMove = fromEvent(this.editor, 'mousemove');
		const $onMouseLeave = fromEvent(this.editor, 'mouseleave');

		$onMouseDown.pipe(
			tap( () => this.canvasSelection = null ),
			map( (mouseDown: MouseEvent) => this.getPositionOnCanvas(mouseDown) ),
			switchMap( (startingPos: ICanvasPosition) => {
				const $selectionStoped = $onMouseMove.pipe(
					// While mouse is moving, get the current position and draw a selection
					map( (mouseMoved: MouseEvent) => this.getPositionOnCanvas(mouseMoved)),
					tap( currentPos => {
						this.clearCanvas();
						this.drawSelection(startingPos, currentPos);
					}),
					// Until mouse is up or leaves
					takeUntil($onMouseUp),
					takeUntil($onMouseLeave),
				);
				return forkJoin( of(startingPos), $selectionStoped );
			}),
			// TODO: to unsubscribe use takeUntil( .. ) user saves the action. Then restart listening on user add new action
		).subscribe( res  => {
			const startingPos = res[0];
			const finalPos = res[1];

			this.setStrokeStyle();
			// Draw selection and show selection menu
			this.drawRectangle(startingPos, finalPos);
			this.canvasSelection = { ... this.canvasSelection, startingPos, finalPos };
			this.showSelectionMenu = true;
		})
	}

	private drawSelection(startingPos, currentPos) {
		const width: number = currentPos.x - startingPos.x;
		const height: number = currentPos.y - startingPos.y;

		this.cx.fillStyle = "#fe812d50";
		this.cx.fillRect(startingPos.x, startingPos.y, width, height);
	}

	private drawRectangle(startingPos: ICanvasPosition, finalPos: ICanvasPosition) {
		const width: number = finalPos.x - startingPos.x;
		const height: number = finalPos.y - startingPos.y;

		this.cx.rect(startingPos.x, startingPos.y, width, height);
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
		this.cx.lineWidth = 2;
		this.cx.lineCap = 'round';
		this.cx.strokeStyle = '#ff812d';
	}

	private clearCanvas() {
		this.cx.clearRect(0, 0, this.editor.width, this.editor.height);
		this.cx.beginPath();
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
