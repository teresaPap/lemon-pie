import { Component, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ElementRef,	EventEmitter } from '@angular/core';
import { fromEvent, Subscription, forkJoin, of, from, Observable } from 'rxjs';
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
	@Input() showLinks?: boolean;
	@Input() mode?: 'preview'|'edit' = 'edit';
	@Output('onSaveArea') onSaveArea?: EventEmitter<IClickableArea> = new EventEmitter<IClickableArea>();
	@Output('onLinkAreaClicked') onLinkAreaClicked?: EventEmitter<string> = new EventEmitter<string>(); // destination file id
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
		if (this.mode === 'preview') {
			console.log('preview mode on');
			this.watchCanvasClicks();
			return;
		}
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
		const mouseDown$ = fromEvent(this.editor, 'mousedown');
		const mouseUp$ = fromEvent(this.editor, 'mouseup');
		const mouseMove$ = fromEvent(this.editor, 'mousemove');
		const mouseLeave$ = fromEvent(this.editor, 'mouseleave');

		mouseDown$.pipe(
			// Initialize for security
			tap(() => this.canvasSelection = null as IClickableArea),
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

	private watchCanvasClicks() {
		const mouseClick$ = fromEvent(this.editor, 'click');

		mouseClick$.pipe(
			tap(res => console.log(res) ),
			map((mouseClick: MouseEvent) => CanvasService.getPositionOnCanvas(mouseClick, this.editor)),
		).subscribe((clickPosition: ICanvasPosition) => {
			console.log('clickPosition: ', clickPosition);
			this.getLinkDestinationFromPosition(clickPosition).subscribe(
				(destinationFileId: string) => {
					this.onLinkAreaClicked.emit(destinationFileId);
				}
			);
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

	private getLinkDestinationFromPosition(pos: ICanvasPosition): Observable<string> {
		// TODO: refactor to be more readable
		const links = this.storage.load('activeLinks');
		const areasX = links.filter(area => ((area.x1 <= pos.x) && (pos.x <= area.x2)) );
		if (!areasX.length) return of(null);

		const areasY = areasX.filter(area => ((area.y1 <= pos.y) && (pos.y <= area.y2)) );
		if (!areasY.length) return of(null);

		return of(areasY[0].destinationFileId);
	}

	// #endregion
}
