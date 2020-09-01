import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { fromEvent, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const MAX_WIDTH: number = 800;
const MAX_HEIGHT: number = 600;

@Injectable({
	providedIn: 'root'
})
export class FileResizeService {

	constructor(private domSanitizer: DomSanitizer) { }

	public resizeFile(file: File): Observable<string> {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		return fromEvent(reader, 'loadend').pipe(
			// @ts-ignore
			map(event => event.target.result ),
			switchMap( base64 => this.resizeImage(base64))
			// TODO: optimize to return earlier when the image does not need any resizing opperations/ img dimensions are acceptable
		)
	}

	private resizeImage(base46): Observable<string> {

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const img = new Image();
		img.src = base46;

		const {width, height} = this.createNewDimensions(img.width, img.height);
		canvas.height = height;
		canvas.width = width;

		// console.log(`w: ${img.width} ${width}\nh: ${img.height} ${height}`);

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		return of( this.domSanitizer.bypassSecurityTrustHtml(canvas.toDataURL('image/jpeg')) ).pipe(
			map( (sanitizedRes: SafeHtml) =>  {
				// @ts-ignore
				return sanitizedRes.changingThisBreaksApplicationSecurity
			})
		);
	}

	private createNewDimensions(imgWidth: number, imgHeight: number): {width: number, height: number} {
		if (imgWidth<=MAX_WIDTH && imgHeight<=MAX_HEIGHT) {
			// width, height are within the allowed values
			return {width: imgWidth, height: imgHeight}
		};
		if (imgWidth>imgHeight) {
			const initialWidth: number = (imgWidth>MAX_WIDTH) ? MAX_WIDTH : imgWidth;
			return {
				width: initialWidth,
				height: initialWidth * (imgHeight / imgWidth)
			};
		} else {
			const initialHeight: number = (imgHeight>MAX_HEIGHT) ? MAX_HEIGHT : imgHeight;
			return {
				width: initialHeight * (imgWidth / imgHeight),
				height: initialHeight
			};
		}
	}
}
