import { Component, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ElementRef,	EventEmitter } from '@angular/core';
import {fromEvent, Subscription, forkJoin, of, from, Observable} from 'rxjs';
import { switchMap, takeUntil, tap, map } from 'rxjs/operators';
import { CanvasService } from '../../services/canvas.service';
import {ICanvasSelection, ILink} from '../../interfaces/ILink';
import { ICanvasPosition } from '../../interfaces/IEditor';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements AfterViewInit, OnChanges {

	private cx: CanvasRenderingContext2D;
	private editor: HTMLCanvasElement;

	private watchForCanvasDragEvents$: Subscription;
	private watchForCanvasClickEvents$: Subscription;

	@Input() imgUrl: string;
	@Input() links?: ILink[];
	@Input() isDrawModeOn: boolean;

	@Output('onAreaSelected') onAreaSelected: EventEmitter<ICanvasSelection> = new EventEmitter<ICanvasSelection>();
	@Output('onCanvasCleared') onCanvasCleared: EventEmitter<void> = new EventEmitter<void>();

	@Output('onLinkAreaClicked') onLinkAreaClicked: EventEmitter<ILink> = new EventEmitter<ILink>();

	@ViewChild('canvasBg') public canvasBg: ElementRef;
	@ViewChild('canvas') public canvas: ElementRef;

	constructor(
		private canvasCtrl: CanvasService,
	) { }

	ngAfterViewInit(): void {
		// get the context
		this.editor = this.canvas.nativeElement;
		this.cx = this.editor.getContext('2d');
		// set up the canvas
		this.setBackground(this.imgUrl);
		// watch for events
		this.startWatchingForCanvasDragEvents();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ((changes.imgUrl && !changes.imgUrl.firstChange)) {
			this.setBackground(changes.imgUrl.currentValue);
		}
		if (changes.links && !changes.links.firstChange) {
			if (changes.links.currentValue==null) {
				this.clearCanvas();
			} else {
				this.drawAreas(this.links);
			}
		}
		if (changes.isDrawModeOn && !changes.links.firstChange) {
			if (changes.isDrawModeOn.currentValue===false) {
				this.watchForCanvasDragEvents$.unsubscribe();
				this.startWatchingForClickEvents();
			} else {
				this.watchForCanvasClickEvents$.unsubscribe();
				this.startWatchingForCanvasDragEvents();
			}
		}
	}

	public clearCanvas(): void {
		CanvasService.clearCanvas(this.cx, this.editor);
	}

	public highlightSelectedLink(link: ILink): void {
		CanvasService.drawRectangle(
			{x: link.x1, y: link.y1},
			{x: link.x2, y: link.y2},
			this.cx
		);
	}

	private startWatchingForCanvasDragEvents(): void {
		this.watchForCanvasDragEvents$ = this.canvasDragEvents$().subscribe(
			(canvasSelection: ICanvasSelection) => {
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

	private startWatchingForClickEvents(): void {
		this.watchForCanvasClickEvents$ = this.canvasClickEvents$().subscribe(
			(clickPosition: ICanvasPosition) => {
				this.canvasCtrl.getLinkDestinationFromPosition(this.links, clickPosition).subscribe(
					(link: ILink) => {
						this.onLinkAreaClicked.emit(link);
					}
				)
		});
	}

	private canvasDragEvents$(): Observable<any> {
		const mouseDown$ = fromEvent(this.editor, 'mousedown');
		const mouseUp$ = fromEvent(this.editor, 'mouseup');
		const mouseMove$ = fromEvent(this.editor, 'mousemove');
		const mouseLeave$ = fromEvent(this.editor, 'mouseleave');

		return mouseDown$.pipe(
			tap( () => {
				this.clearCanvas();
				this.onCanvasCleared.emit();
			}),
			// Watch while mouse is down
			map((mouseDown: MouseEvent) => CanvasService.getPositionOnCanvas(mouseDown, this.editor)),
			switchMap((startingPos: ICanvasPosition) => {
				const selectionStoped$ = mouseMove$.pipe(
					// While mouse is moving, get the current position and draw a selection
					map((mouseMoved: MouseEvent) => CanvasService.getPositionOnCanvas(mouseMoved, this.editor)),
					tap(currentPos => {
						this.clearCanvas();
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
		);

	}

	private canvasClickEvents$(): Observable<any> {
		const mouseClick$ = fromEvent(this.editor, 'click');

		return mouseClick$.pipe(
			map((mouseClick: MouseEvent) => CanvasService.getPositionOnCanvas(mouseClick, this.editor))
		);
	}

	private setBackground(url): void {
		this.canvasCtrl.setBackground(url, this.canvasBg, this.editor).subscribe();
	}

	private drawAreas(clickableAreas: ILink[] ): any {
		CanvasService.setStrokeStyle(this.cx);
		clickableAreas.map(area => {
			const startingPos = { x: area.x1, y: area.y1 };
			const finalPos = { x: area.x2, y: area.y2 };
			return CanvasService.drawRectangle(startingPos, finalPos, this.cx);
		});
	}


	// Canvas events handling
	// see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

}
