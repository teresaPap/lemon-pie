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

	public resizeImage(base46, height: number, width: number) {

		const tempCanvas = document.createElement('canvas');

		tempCanvas.height = (height*50)/100;
		tempCanvas.width = (width*50)/100;

		const tempImg = new Image();
		tempImg.src = base46;

		const tempCtx = tempCanvas.getContext('2d');
		tempCtx.drawImage(tempImg, 0, 0);

		return of( this.domSanitizer.bypassSecurityTrustHtml(tempCanvas.toDataURL('image/jpeg')) ).pipe(
			// @ts-ignore
			map( sanitizedRes =>  sanitizedRes.changingThisBreaksApplicationSecurity )
		);

	}




}
