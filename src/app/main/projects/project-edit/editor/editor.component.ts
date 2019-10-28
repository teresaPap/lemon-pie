import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subscription, forkJoin, of } from 'rxjs';
import { switchMap, takeUntil, tap, map } from 'rxjs/operators';
import { IClickableArea } from '../../../../shared/interfaces/IFile';
import { CanvasService } from '../../../../shared/services/canvas.service';
import { ICanvasPosition } from '../../../../shared/interfaces/IEditor';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements AfterViewInit, OnInit, OnDestroy {

	@Input() imgUrl: string;
	@Output('onSaveArea') onSaveArea: EventEmitter<IClickableArea> = new EventEmitter<IClickableArea>();


	@ViewChild('canvasBg', { static: false }) public canvasBg: ElementRef;
	@ViewChild('canvas', { static: false }) public canvas: ElementRef;
	private cx: CanvasRenderingContext2D;
	private editor: HTMLCanvasElement;

	public showSelectionMenu: boolean;
	private canvasSelection: IClickableArea;

	constructor( private canvasCtrl: CanvasService ) { }

	ngOnInit(): void {
		console.log('Editor Ready');
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

	public saveLink(selectedFileId: string): void {
		this.canvasCtrl.clearCanvas(this.cx, this.editor);
		this.canvasSelection.linkedFileId = selectedFileId;
		this.onSaveArea.emit(this.canvasSelection);
		this.showSelectionMenu = false;
	}

	public closeSelectionMenu(): void {
		this.canvasCtrl.clearCanvas(this.cx, this.editor);
		this.canvasSelection = null as IClickableArea;
		console.log('Selection canceled.');
		this.showSelectionMenu = false;
	}

	// #region - Canvas events handling - see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private watchCanvasEvents() {
		// TODO: onMouseDown$ instead of onMouseDown :P
		const $onMouseDown = fromEvent(this.editor, 'mousedown');
		const $onMouseUp = fromEvent(this.editor, 'mouseup');
		const $onMouseMove = fromEvent(this.editor, 'mousemove');
		const $onMouseLeave = fromEvent(this.editor, 'mouseleave');

		$onMouseDown.pipe(
			// Initialize for security
			tap(() => this.canvasSelection = null as IClickableArea),
			// Watch while mouse is down
			map((mouseDown: MouseEvent) => this.canvasCtrl.getPositionOnCanvas(mouseDown, this.editor)),
			switchMap((startingPos: ICanvasPosition) => {
				const $selectionStoped = $onMouseMove.pipe(
					// While mouse is moving, get the current position and draw a selection
					map((mouseMoved: MouseEvent) => this.canvasCtrl.getPositionOnCanvas(mouseMoved, this.editor)),
					tap(currentPos => {
						this.canvasCtrl.clearCanvas(this.cx, this.editor);
						this.canvasCtrl.drawSelection(startingPos, currentPos, this.cx);
					}),
					// Until mouse is up or leaves
					takeUntil($onMouseUp),
					takeUntil($onMouseLeave),
				);
				return forkJoin(of(startingPos), $selectionStoped);
			}),
			// TODO: to unsubscribe use takeUntil( .. ) user saves the action. Then restart listening on user add new action
		).subscribe(res => {
			const startingPos = res[0];
			const finalPos = res[1];

			this.canvasCtrl.setStrokeStyle( this.cx, '#ff812d' );
			// Draw selection and show selection menu
			this.canvasCtrl.drawRectangle(startingPos, finalPos, this.cx);
			this.canvasSelection = {
				... this.canvasSelection,
				x1: startingPos.x,
				y1: startingPos.y,
				x2: finalPos.x,
				y2: finalPos.y
			};
			this.showSelectionMenu = true;
		})
	}

	private setBackground(url): Subscription {
		
		const img = this.canvasBg.nativeElement; 
		img.src = url;

		return this.canvasCtrl.getSizeFromImage(img).subscribe(
			dimentions => {
				this.editor.height = dimentions.height;
				this.editor.width = dimentions.width;
			}
		)
	}

	// #endregion




}