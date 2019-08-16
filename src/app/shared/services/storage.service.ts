import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

	constructor() { }



	public store(id:string, item:any): void {
		const value: string = JSON.stringify(item);
		sessionStorage.setItem(id, value);
	}

	public load(id:string): any {
		const item = sessionStorage.getItem(id);
		return JSON.parse(item);
	}

}
