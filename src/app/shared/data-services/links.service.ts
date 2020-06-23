import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

	public readAllLinks(fileId: string): Observable<any[]> {
		return this.apiService.readDocumentChildReferences(`files/${fileId}`).pipe(
			tap( res => {
				this.linkList = res;
				this.changeActiveLinkList();
			})
		);
	}

	public create(link: IClickableArea, parentFileId: string): Observable<ILink|any> {
		return this.apiService.createDocument(link, 'links', `files/${parentFileId}`).pipe(
			tap( res => {
				this.linkList.push(res);
				this.changeActiveLinkList();
			})
		);
	}

}
