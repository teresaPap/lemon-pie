import { Injectable } from '@angular/core';
import { ICanvasPosition } from '../interfaces/IEditor';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SELECTION_FILL_COLOR = 'rgba(96,221,204,0.31)';
const SELECTION_STROKE_COLOR = '#60ddcc'; // $theme-accent


@Injectable({
	providedIn: 'root'
})
export class CanvasService {

	constructor() { }

	public static async drawRectangle(
		startingPos: ICanvasPosition,
		finalPos: ICanvasPosition,
		cx: CanvasRenderingContext2D): Promise<void> {
		const width: number = finalPos.x - startingPos.x;
		const height: number = finalPos.y - startingPos.y;

		await cx.rect(startingPos.x, startingPos.y, width, height);

		return cx.stroke();

		// BUG: offset when painting on canvas
		// occures if the canvas is resided to fit the screen (this happends automatically)
		// TODO: use css to display image real size and add scroll bars horizontally and vertically
		// Otherwise, for responsiveness,  give the canvas the size of the image as it appears on the screen
		// (switch img.naturalHeight with sth ele, if applicable)
	}

	public static drawSelection(startingPos: ICanvasPosition, currentPos: ICanvasPosition, cx: CanvasRenderingContext2D ) {
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

}
