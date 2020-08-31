import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser'

@Injectable({
	providedIn: 'root'
})
export class FileResizeService {

	// wip

	constructor(private domSanitizer: DomSanitizer) { }

	public readImgDimenions(file: File): Observable<{base64:any, height: number, width: number}> {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		return fromEvent(reader, 'loadend').pipe(
			// @ts-ignore
			map(event => event.target.result ),
			switchMap(base64 => {
				const img = new Image();
				img.src = base64;
				return fromEvent(img, 'load').pipe(
					map(() => {
						return {
							base64: base64,
							height: img.naturalHeight,
							width: img.naturalWidth
						}
					}))
			})
		);
	}

	public resizeImage(base46) {

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const img = new Image();

		img.src = base46;

		canvas.width = img.width * 0.5;
		canvas.height = img.height * 0.5;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// step 2
		ctx.drawImage(canvas, 0, 0, canvas.width * 0.5, canvas.height * 0.5);

		// step 3, resize to final size
		ctx.drawImage(canvas, 0, 0, canvas.width * 0.5, canvas.height * 0.5,
			0, 0, canvas.width, canvas.height);

		return of( this.domSanitizer.bypassSecurityTrustHtml(canvas.toDataURL('image/jpeg')) ).pipe(

			map( sanitizedRes =>  {
				console.log(sanitizedRes);
				// @ts-ignore
				return sanitizedRes.changingThisBreaksApplicationSecurity
			})
		);

	}




}
