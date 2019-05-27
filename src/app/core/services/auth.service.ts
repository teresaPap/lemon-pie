import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenHelperService } from './token-helper.service';
import { ILoginData } from '../../shared/interfaces/ILoginData';
import { Constants } from '../../config/constants';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';

const API_ENDPOINT: string = Constants.API_ENDPOINT;

@Injectable()
export class AuthService {

    private activeUsername = new Subject<string>();

    public setActiveUsername( username : string): void { this.activeUsername.next(username) };
    
    public getActiveUsername(): Observable<string> { return this.activeUsername.asObservable(); }

    constructor( 
        private http: HttpClient,
        private tokenHelper: TokenHelperService ) { }

        
    public isLoggedIn(): boolean {
        // return this.tokenHelper.isTokenExpired();
        return !!localStorage.getItem('isLoggedIn');
    }
    
    public login( data: ILoginData ): Observable<boolean> { 
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('Username', data.username);
        this.setActiveUsername( data.username );
        return Observable.of(true);
    }

    public logout(): void {
        localStorage.clear();
        this.setActiveUsername('');
    }

}
