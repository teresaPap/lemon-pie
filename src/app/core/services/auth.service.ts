import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenHelperService } from './token-helper.service';
import { ILoginData } from '../../shared/interfaces/ILoginData';
import { Constants } from '../../config/constants';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

const API_ENDPOINT: string = Constants.API_ENDPOINT;

@Injectable()
export class AuthService {

    constructor( 
        private http: HttpClient,
        private tokenHelper: TokenHelperService ) { }

    public isLoggedIn(): boolean {
        // return this.tokenHelper.isTokenExpired();
        return !!localStorage.getItem('isLoggedIn');
    }
    
    public login( data: ILoginData ): boolean { 
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('Username', data.username);
        return true;
    }

    public logout(): void {
        localStorage.clear();
    }

    public getUsername(): string {
        return localStorage.getItem('Username');
    }

}
