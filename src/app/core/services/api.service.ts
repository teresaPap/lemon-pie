import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TokenHelperService } from './token-helper.service';
import { Constants } from '../../config/constants';

import { HttpClient } from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { of } from 'rxjs/observable/of';


const API_ENDPOINT: string = Constants.API_ENDPOINT;

@Injectable()
export class ApiService {

    public contractId:number;
    
    constructor( 
		public storage: AngularFireStorage,
        private http: HttpClient,
        private tokenHelper: TokenHelperService ) { }

    public get( url:string ) : Observable<any> {
        return this.http.get( `${API_ENDPOINT}/${url}` );
    }

    public post( url:string ,data: any ) : Observable<any> {
        return this.http.post( `${API_ENDPOINT}/${url}`, data );
    }

	public firebasePost(path: string, data: any) : Observable<AngularFireUploadTask> {
		return of( this.storage.upload(path, data) );
	}








    // // TODO: use interceptors instead of authOptions() 
    
    // private authOptions(): RequestOptions {
    //     const token = this.tokenHelper.getToken();
    //     let headers = new Headers();
    //     headers.append('Content-type', 'application/json' );
    //     headers.append('Authorization', `Bearer `+ token );
    //     return new RequestOptions( {  headers: headers });
    // }


}
