import { Injectable } from '@angular/core';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { Observable } from 'rxjs';
import { IClickableArea, ILink } from '../interfaces/ILink';

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
