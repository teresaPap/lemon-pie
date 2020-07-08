import { Injectable } from '@angular/core';
import { ICanvasPosition } from '../interfaces/IEditor';
import {fromEvent, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {removeOptionsParameter} from "@angular/core/schematics/migrations/dynamic-queries/util";
import {ILink} from "../interfaces/ILink";

const SELECTION_FILL_COLOR = 'rgba(212,209,24,0.53)';
const SELECTION_STROKE_COLOR = '#c4b90b'; // $theme-accent


@Injectable({
	providedIn: 'root'
})
export class CanvasService {

	constructor() { }

	public static drawRectangle(startingPos: ICanvasPosition, finalPos: ICanvasPosition, cx: CanvasRenderingContext2D): void{
		const width: number = finalPos.x - startingPos.x;
		const height: number = finalPos.y - startingPos.y;

		cx.fillStyle = SELECTION_FILL_COLOR;
		cx.fillRect(startingPos.x, startingPos.y, width, height);

		cx.rect(startingPos.x, startingPos.y, width, height);
		cx.stroke();
	}

	public static highlightRectangle(startingPos: ICanvasPosition, finalPos: ICanvasPosition, cx: CanvasRenderingContext2D, editor: HTMLCanvasElement): void {
		const width: number = finalPos.x - startingPos.x;
		const height: number = finalPos.y - startingPos.y;

		let opacity = 1;
		let fade = false;

		const interval = setInterval(() => {
			cx.clearRect(startingPos.x, startingPos.y, width, height);

			opacity = (fade) ? --opacity : ++opacity ;

			cx.fillStyle = `rgba(212,209,24,0.${opacity})`;
			cx.fillRect(startingPos.x, startingPos.y, width, height);

			if (opacity<=0) {
				clearInterval(interval);
				this.clearCanvas(cx, editor);
				return;
			} else if (opacity>=9) {
				fade = true;
			}

		},20);

	}

	public static drawSelection(startingPos: ICanvasPosition, currentPos: ICanvasPosition, cx: CanvasRenderingContext2D ): void {
		const width: number = currentPos.x - startingPos.x;
		const height: number = currentPos.y - startingPos.y;

		cx.fillStyle = SELECTION_FILL_COLOR;
		cx.fillRect(startingPos.x, startingPos.y, width, height);
	}

	public static clearCanvas(cx: CanvasRenderingContext2D, editor: HTMLCanvasElement ): void {
		cx.clearRect(0, 0, editor.width, editor.height);
		cx.beginPath();
	}

	public static getPositionOnCanvas(e: MouseEvent, editor: HTMLCanvasElement ): ICanvasPosition {
		const rect = editor.getBoundingClientRect();
		const position: ICanvasPosition = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
		return position;
	}

	public static setStrokeStyle(cx: CanvasRenderingContext2D ) {
		cx.lineWidth = 2;
		cx.lineCap = 'round';
		cx.strokeStyle = SELECTION_STROKE_COLOR;
	}

	public getSizeFromImage(img): Observable<any> {
		return fromEvent(img, 'load').pipe(
			map( () => {
				// get natural image size
				// console.log(`Image size: ${img.naturalWidth} x ${img.naturalHeight}`);
				return { height: img.naturalHeight, width: img.naturalWidth };
			})
		);
	}

	public getLinkDestinationFromPosition(links:ILink[], pos: ICanvasPosition): Observable<string> {
		// TODO: should be more readable

		const areasX: ILink[] = links.filter(area => ((area.x1 <= pos.x) && (pos.x <= area.x2)) );
		if (!areasX.length) return of(null);

		const areasY: ILink[] = areasX.filter(area => ((area.y1 <= pos.y) && (pos.y <= area.y2)) );
		if (!areasY.length) return of(null);

		return of(areasY[0].destinationFileId);
	}

}
