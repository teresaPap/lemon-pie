import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';


@Injectable()
export class FileUploadService {

	constructor( private apiService: ApiService ) { }

	postFile(fileToUpload: File): Observable<boolean> {

		const formData: FormData = new FormData();
		formData.append('fileKey', fileToUpload, fileToUpload.name);

		return this.apiService.post( 'my-file-endpoint', formData ).pipe(
			map( r => {
				// TODO: check if files have been submitted without errors. 
				if (r) return true;
				return false;
			})
		);
	}

}
