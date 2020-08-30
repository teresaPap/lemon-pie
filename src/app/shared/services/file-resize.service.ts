import { Injectable } from '@angular/core';
import {fromEvent, Observable, of} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class FileResizeService {

	// wip

	constructor() { }

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
		const img = new Image();
		img.height = (height*50)/100;
		img.width = (width*50)/100;

		img.src = base46;
		return of(img);
	}




}
