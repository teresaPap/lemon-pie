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
		)
	}

	private resizeImage(base46): Observable<string> {
		const img = new Image();
		img.src = base46;
		if (img.width<=MAX_WIDTH && img.height<=MAX_HEIGHT) {
			// width, height are within the allowed values
			return of(base46);
		};

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const {width, height} = this.createNewDimensions(img.width, img.height);
		canvas.height = height;
		canvas.width = width;

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		return of( this.domSanitizer.bypassSecurityTrustHtml(canvas.toDataURL('image/jpeg')) ).pipe(
			map( (sanitizedRes: SafeHtml) =>  {
				// @ts-ignore
				return sanitizedRes.changingThisBreaksApplicationSecurity
			})
		);
	}

	private createNewDimensions(imgWidth: number, imgHeight: number): {width: number, height: number} {
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
