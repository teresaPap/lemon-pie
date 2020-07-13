import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { IClickableArea, ILink } from '../interfaces/ILink';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

	private linkList: ILink[] = [];
	private activeLinkListSource = new BehaviorSubject<ILink[]>([] as ILink[]);

	public activeLinkListChanges$ = this.activeLinkListSource.asObservable();

	constructor(
  		private apiService: FirebaseApiService
  	) { }

	public changeActiveLinkList(): void {
		this.activeLinkListSource.next(this.linkList);
	}

	public readAllLinks(fileId: string): Observable<any> {
		return this.apiService.readDocsFromCollection(`files/${fileId}/links`).pipe(
			tap( res => {
				this.linkList = res;
				this.changeActiveLinkList();
			})
		);
	}

	public create(link: IClickableArea, parentFileId: string): Observable<ILink|any> {
		return this.apiService.createDocument(link, `files/${parentFileId}/links`).pipe(
			tap( res => {
				this.linkList.push(res);
				this.changeActiveLinkList();
			})
		);
	}

	public update(linkId: string, parentFileId: string, fields: any) {
		return this.apiService.updateDocument(`files/${parentFileId}/links/${linkId}`, fields).pipe(
			tap(() => {
				const index = this.linkList.findIndex(link => link.id === linkId);
				this.linkList[index] = { ...fields };
				this.changeActiveLinkList();
			})
		)
	}


	public delete(linkId: string, fileId: string) {
		return this.apiService.deleteDoc(`files/${fileId}/links/${linkId}`).pipe(
			tap(res => {
				console.log(res);
				const index = this.linkList.findIndex(link => link.id === linkId);
				this.linkList.splice(index,1);
				this.changeActiveLinkList();
			})
		)
	}

}
