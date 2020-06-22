import { Injectable } from '@angular/core';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import {IClickableArea, ILink} from "../interfaces/ILink";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  	constructor(
  		private apiService: FirebaseApiService
  	) { }

  	public create(link: IClickableArea, parentFileId: string): Observable<ILink|any> {
		return this.apiService.createDocument(link, 'links', `files/${parentFileId}`);
	}

}
