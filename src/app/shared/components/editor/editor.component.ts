import { Component, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ElementRef,	EventEmitter } from '@angular/core';
import { fromEvent, Subscription, forkJoin, of, from } from 'rxjs';
import { switchMap, takeUntil, tap, map } from 'rxjs/operators';
import { CanvasService } from '../../services/canvas.service';
import { StorageService } from '../../services/storage.service';
import { ICanvasSelection } from '../../interfaces/ILink';
import { ICanvasPosition } from '../../interfaces/IEditor';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements AfterViewInit, OnChanges {

	private cx: CanvasRenderingContext2D;
	private editor: HTMLCanvasElement;

	@Input() imgUrl: string;
	@Input() showLinks?: boolean;

	@Output('onAreaSelected') onAreaSelected: EventEmitter<ICanvasSelection> = new EventEmitter<ICanvasSelection>();
	@Output('onCanvasCleared') onCanvasCleared: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild('canvasBg') public canvasBg: ElementRef;
	@ViewChild('canvas') public canvas: ElementRef;

	constructor(
		private canvasCtrl: CanvasService,
		private storage: StorageService
	) { }

	ngAfterViewInit(): void {
		// get the context
		this.editor = this.canvas.nativeElement;
		this.cx = this.editor.getContext('2d');
		// set up the canvas
		this.setBackground(this.imgUrl);
		// watch for events
		this.watchCanvasEvents();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.showLinks) {
			if (!changes.showLinks.firstChange) {
				if (changes.showLinks.currentValue) {
					this.drawSavedLinks();
				} else {
					CanvasService.clearCanvas(this.cx, this.editor);
				}
			}
		}
		if (changes.imgUrl) {
			if (!changes.imgUrl.firstChange ) {
				this.setBackground(changes.imgUrl.currentValue);
			}
		}
	}

	private drawSavedLinks() {
		const links = this.storage.load('activeLinks');
		this.drawSavedAreas(links);
	}

	// #region - Canvas events handling
	// see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private watchCanvasEvents() {
		console.log('Watching canvas evens');
		const mouseDown$ = fromEvent(this.editor, 'mousedown');
		const mouseUp$ = fromEvent(this.editor, 'mouseup');
		const mouseMove$ = fromEvent(this.editor, 'mousemove');
		const mouseLeave$ = fromEvent(this.editor, 'mouseleave');

		mouseDown$.pipe(
			tap( () => {
				CanvasService.clearCanvas(this.cx, this.editor);
				this.onCanvasCleared.emit();
			}),
			// Watch while mouse is down
			map((mouseDown: MouseEvent) => CanvasService.getPositionOnCanvas(mouseDown, this.editor)),
			switchMap((startingPos: ICanvasPosition) => {
				const selectionStoped$ = mouseMove$.pipe(
					// While mouse is moving, get the current position and draw a selection
					map((mouseMoved: MouseEvent) => CanvasService.getPositionOnCanvas(mouseMoved, this.editor)),
					tap(currentPos => {
						CanvasService.clearCanvas(this.cx, this.editor);
						CanvasService.drawSelection(startingPos, currentPos, this.cx);
					}),
					// Until mouse is up or leaves
					takeUntil(mouseUp$),
					takeUntil(mouseLeave$),
				);
				return forkJoin([of(startingPos), selectionStoped$]);
			}),
			map( res => {
				// format x1,2 and y1,2 so that x1<x2 & y1<y2
				const startingPos = res[0];
				const finalPos = res[1];

				return {
					x1: (startingPos.x<=finalPos.x) ? startingPos.x : finalPos.x ,
					y1: (startingPos.y<=finalPos.y) ? startingPos.y : finalPos.y ,
					x2: (startingPos.x>finalPos.x) ? startingPos.x : finalPos.x ,
					y2: (startingPos.y>finalPos.y) ? startingPos.y : finalPos.y ,
				};
			})
		).subscribe((canvasSelection: ICanvasSelection) => {
			CanvasService.setStrokeStyle(this.cx);
			// Draw selection and show selection menu
			CanvasService.drawRectangle(
				{x: canvasSelection.x1, y: canvasSelection.y1},
				{x: canvasSelection.x2, y: canvasSelection.y2},
				this.cx
			);
			this.onAreaSelected.emit(canvasSelection);
		});
	}

	private setBackground(url): Subscription {

		const img = this.canvasBg.nativeElement;
		img.src = url;

		return this.canvasCtrl.getSizeFromImage(img).subscribe(
			dimensions => {
				this.editor.height = dimensions.height;
				this.editor.width = dimensions.width;
			}
		);
	}

	private drawSavedAreas(clickableAreas): any {
		CanvasService.setStrokeStyle(this.cx);
		clickableAreas.map(area => {
			const startingPos = { x: area.x1, y: area.y1 };
			const finalPos = { x: area.x2, y: area.y2 };
			return from( CanvasService.drawRectangle(startingPos, finalPos, this.cx) );
		});
	}


	// #endregion
}
