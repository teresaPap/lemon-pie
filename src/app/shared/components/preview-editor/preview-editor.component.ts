import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subscription, fromEvent, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICanvasPosition } from '../../interfaces/IEditor';
import { ILink } from '../../interfaces/ILink';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-preview-editor',
  templateUrl: './preview-editor.component.html',
})
export class PreviewEditorComponent implements AfterViewInit, OnChanges {

	private cx: CanvasRenderingContext2D;
	private editor: HTMLCanvasElement;

	@Input() imgUrl: string;
	@Input() links?: ILink[];

	@Output('onLinkAreaClicked') onLinkAreaClicked: EventEmitter<string> = new EventEmitter<string>();

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
		this.watchCanvasEvents();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.imgUrl) {
			if (!changes.imgUrl.firstChange ) {
				this.setBackground(changes.imgUrl.currentValue);
			}
		}
	}

	public highlightLinks(): void {
		for( let link of this.links ) {
			CanvasService.highlightRectangle(
				{x: link.x1, y: link.y1},
				{x: link.x2, y: link.y2},
				this.cx,
				this.editor
			);
		}
	}

	private watchCanvasEvents() {
		const mouseClick$ = fromEvent(this.editor, 'click');

		mouseClick$.pipe(
			map((mouseClick: MouseEvent) => CanvasService.getPositionOnCanvas(mouseClick, this.editor))
		).subscribe((clickPosition: ICanvasPosition) => {
			this.getLinkDestinationFromPosition(clickPosition).subscribe(
				(linkId: string) => {
					this.onLinkAreaClicked.emit(linkId);
				}
			);
		});
	}

	private getLinkDestinationFromPosition(pos: ICanvasPosition): Observable<string> {
		// TODO: should be more readable

		const areasX: ILink[] = this.links.filter(area => ((area.x1 <= pos.x) && (pos.x <= area.x2)) );
		if (!areasX.length) return of(null);

		const areasY: ILink[] = areasX.filter(area => ((area.y1 <= pos.y) && (pos.y <= area.y2)) );
		if (!areasY.length) return of(null);

		return of(areasY[0].destinationFileId);
	}

	private setBackground(url): Subscription {
		const img = this.canvasBg.nativeElement;
		img.src = url;

		return this.canvasCtrl.getSizeFromImage(img).subscribe(
			dimensions => {
				this.editor.height = dimensions.height;
				this.editor.width = dimensions.width;

				this.editor.parentElement.setAttribute(
					'style',
					`
					height: ${dimensions.height}px;
					width: ${dimensions.width}px;
				`);
			}
		);
	}

}
