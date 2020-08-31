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

	public resizeImage(base46, imgHeight, imgWidth) {

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const img = new Image();
		img.src = base46;

		// resizing works
		// TODO: add implementation to control the new dimensions
		canvas.height = 100; // hardcoded
		canvas.width = canvas.height * (img.width / img.height); // set width in proportion with height

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		return of( this.domSanitizer.bypassSecurityTrustHtml(canvas.toDataURL('image/jpeg')) ).pipe(

			map( sanitizedRes =>  {
				console.log(sanitizedRes);
				// @ts-ignore
				return sanitizedRes.changingThisBreaksApplicationSecurity
			})
		);

	}

	public resizeImageFile(file: File) {
		if (!RegExp('image/*').test(file.type)) {
			return 'this is not an image';
		}
		if (file.size<100000) {
			// file size is accepted, do not proceed with transformations
			return file;
		}





	}


	// public resizeBase64Img(base64, width, height) {
	// 	const canvas = document.createElement("canvas");
	// 	canvas.width = width;
	// 	canvas.height = height;
	// 	const context = canvas.getContext("2d");
	//
	//
	//
	// 	const deferred = $.Deferred();
	// 	$("<img/>").attr("src", "data:image/gif;base64," + base64).load(function() {
	// 		context.scale(width/this.width,  height/this.height);
	// 		context.drawImage(this, 0, 0);
	// 		deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
	// 	});
	// 	return deferred.promise();
	// }

}
