import { Injectable } from '@angular/core';
import { ICanvasPosition } from '../interfaces/IEditor';
import { Subscription, fromEvent, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CanvasService {

	constructor() { }

	public drawSelection(startingPos:ICanvasPosition, currentPos:ICanvasPosition, cx:CanvasRenderingContext2D ) {
		const width: number = currentPos.x - startingPos.x;
		const height: number = currentPos.y - startingPos.y;

		cx.fillStyle = "#fe812d50";
		cx.fillRect(startingPos.x, startingPos.y, width, height);
	}

	public drawRectangle(startingPos:ICanvasPosition, finalPos:ICanvasPosition, cx:CanvasRenderingContext2D) {
		const width: number = finalPos.x - startingPos.x;
		const height: number = finalPos.y - startingPos.y;

		cx.rect(startingPos.x, startingPos.y, width, height);
		cx.stroke();


		// BUG: offset when painting on canvas 
		// occures if the canvas is resided to fit the screen (this happends automatically)
		// TODO: use css to display image real size and add scroll bars horizontally and vertically
		// Otherwise, for responsiveness,  give the canvas the size of the image as it appears on the screen (swich img.naturalHeight with sth ele, if applicable)
	}

	public getSizeFromImage(img): Observable<any> {
		// TODO: return the heigh and width of the stored downloadURL so that the component creates a canvas this size. 
		// const activeFile = JSON.parse(localStorage.getItem('activeFile'))
		// const url = activeFile.downloadURL;

		// const img = new Image; 
		// img.src = url;

		// read img
		return fromEvent(img, 'load').pipe(
			map( () => {
				// get natural image size
				console.log(`Image size: ${img.naturalWidth} x ${img.naturalHeight}`);
				return {height:img.naturalHeight, width: img.naturalWidth}
			}) 
		);
	}

	public setStrokeStyle( cx:CanvasRenderingContext2D ) {
		// TODO: maybe create a panel for user to set the style
		cx.lineWidth = 2;
		cx.lineCap = 'round';
		cx.strokeStyle = '#ff812d';
	}

	public clearCanvas( cx:CanvasRenderingContext2D, editor: HTMLCanvasElement ): void {
		cx.clearRect(0, 0, editor.width, editor.height);
		cx.beginPath();
	}

	public getPositionOnCanvas( e:MouseEvent, editor: HTMLCanvasElement ): ICanvasPosition {
		const rect = editor.getBoundingClientRect();
		const position: ICanvasPosition = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
		return position;
	}
}
