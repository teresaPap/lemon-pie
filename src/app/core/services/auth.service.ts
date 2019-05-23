import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenHelperService } from './token-helper.service';
import { ILoginData } from '../../shared/interfaces/ILoginData';
import { Constants } from '../../config/constants';
import { tap } from 'rxjs/operators';

const API_ENDPOINT: string = Constants.API_ENDPOINT;

@Injectable()
export class AuthService {

    constructor( 
        private http: HttpClient,
        private tokenHelper: TokenHelperService ) { }

    public isLoggedIn(): boolean {
        return this.tokenHelper.isTokenExpired();
    }
    
    public login(data: ILoginData ): Observable<any> { 
        
        return this.http.post( `${API_ENDPOINT}/api/Auth/Login`, data ).pipe(
            tap( r => {
                console.log('Login response: ', r );
                this.tokenHelper.setToken(r.token);
            })
        );
    }

}
