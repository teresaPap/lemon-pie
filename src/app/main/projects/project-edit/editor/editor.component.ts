import { Component, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ElementRef,	EventEmitter } from '@angular/core';
import { fromEvent, Subscription, forkJoin, of, from } from 'rxjs';
import { switchMap, takeUntil, tap, map } from 'rxjs/operators';
import { CanvasService } from '../../../../shared/services/canvas.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { IClickableArea } from '../../../../shared/interfaces/ILink';
import { ICanvasPosition } from '../../../../shared/interfaces/IEditor';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html'
})
export class EditorComponent implements AfterViewInit, OnChanges {
	@Input() imgUrl: string;
	@Input() showLinks: boolean;
	@Output('onSaveArea') onSaveArea: EventEmitter<IClickableArea> = new EventEmitter<IClickableArea>();
	@ViewChild('canvasBg') public canvasBg: ElementRef;
	@ViewChild('canvas') public canvas: ElementRef;
	@ViewChild('selectionMenu') public selectionMenu: ElementRef;

	private cx: CanvasRenderingContext2D;
	private editor: HTMLCanvasElement;
	private canvasSelection: IClickableArea;
	public showSelectionMenu: boolean;

	constructor(
		private canvasCtrl: CanvasService,
		private storage: StorageService
	) { }

	ngAfterViewInit(): void {
		this.selectionMenu.nativeElement.style.visibility = 'hidden';

		// get the context
		this.editor = this.canvas.nativeElement;
		this.cx = this.editor.getContext('2d');

		// set up the canvas
		this.setBackground(this.imgUrl);

		// Start watching for canvas events
		this.watchCanvasEvents();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);

		if (changes.showLinks) {
			if (!changes.showLinks.firstChange) {
				if (changes.showLinks.currentValue) {
					console.log('draw');
					this.onLinksVisible();
				} else {
					console.log('clear');
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

	// #region - selection menu (mini pop up)

	public saveLink(selectedFileId: string): void {
		this.canvasSelection.destinationFileId = selectedFileId;
		this.onSaveArea.emit(this.canvasSelection);
		this.closeSelectionMenu();
	}

	public closeSelectionMenu(): void {
		CanvasService.clearCanvas(this.cx, this.editor);
		this.canvasSelection = null as IClickableArea;
		this.showSelectionMenu = false;
		this.selectionMenu.nativeElement.style.visibility = 'hidden';
	}

	private openSelectionMenu(mouseX, mouseY): void {
		this.showSelectionMenu = true;
		this.selectionMenu.nativeElement.style.top = `${mouseY - 10}px`;
		this.selectionMenu.nativeElement.style.left = `${mouseX - 10}px`;
		this.selectionMenu.nativeElement.style.visibility = 'visible';
	}

	// #endregion

	private onLinksVisible() {
		const links = this.storage.load('activeLinks');
		this.drawSavedAreas(links);
	}

	// #region - Canvas events handling
	// see also https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415

	private watchCanvasEvents() {
		// TODO: onMouseDown$ instead of onMouseDown :P
		const onMouseDown$ = fromEvent(this.editor, 'mousedown');
		const onMouseUp$ = fromEvent(this.editor, 'mouseup');
		const onMouseMove$ = fromEvent(this.editor, 'mousemove');
		const onMouseLeave$ = fromEvent(this.editor, 'mouseleave');

		onMouseDown$.pipe(
			// Initialize for security
			tap(() => this.canvasSelection = null as IClickableArea),
			// Watch while mouse is down
			map((mouseDown: MouseEvent) => CanvasService.getPositionOnCanvas(mouseDown, this.editor)),
			switchMap((startingPos: ICanvasPosition) => {
				const selectionStoped$ = onMouseMove$.pipe(
					// While mouse is moving, get the current position and draw a selection
					map((mouseMoved: MouseEvent) => CanvasService.getPositionOnCanvas(mouseMoved, this.editor)),
					tap(currentPos => {
						CanvasService.clearCanvas(this.cx, this.editor);
						CanvasService.drawSelection(startingPos, currentPos, this.cx);
					}),
					// Until mouse is up or leaves
					takeUntil(onMouseUp$),
					takeUntil(onMouseLeave$),
				);
				return forkJoin([of(startingPos), selectionStoped$]);
			}),
			// TODO: to unsubscribe use takeUntil( .. ) user saves the action. Then restart listening on user add new action
		).subscribe(res => {
			const startingPos = res[0];
			const finalPos = res[1];

			CanvasService.setStrokeStyle(this.cx);
			// Draw selection and show selection menu
			CanvasService.drawRectangle(startingPos, finalPos, this.cx);
			this.canvasSelection = {
				... this.canvasSelection,
				x1: startingPos.x,
				y1: startingPos.y,
				x2: finalPos.x,
				y2: finalPos.y
			};
			this.openSelectionMenu(finalPos.x, finalPos.y);
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
		console.log(`Clickable Areas to draw: ${clickableAreas.length}`);

		CanvasService.setStrokeStyle(this.cx);
		clickableAreas.map(area => {
			const startingPos = { x: area.x1, y: area.y1 };
			const finalPos = { x: area.x2, y: area.y2 };
			return from( CanvasService.drawRectangle(startingPos, finalPos, this.cx) );
		});
	}

	// #endregion
}
