import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenHelperService } from './token-helper.service';
import { ILoginData } from '../../shared/interfaces/ILoginData';
import { Constants } from '../../config/constants';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


const API_ENDPOINT: string = Constants.API_ENDPOINT;

@Injectable()
export class AuthService {

	private subject = new Subject<string>();

	public setActiveUsername(username: string): void { this.subject.next(username) };

	public getActiveUsername(): Observable<string> { return this.subject.asObservable(); }

	constructor(
		private http: HttpClient,
		private tokenHelper: TokenHelperService,
		public afAuth: AngularFireAuth) { }


	public isLoggedIn(): boolean {
		// return this.tokenHelper.isTokenExpired();
		return !!localStorage.getItem('isLoggedIn');
	}

	public login(data: ILoginData): Observable<boolean> {
		localStorage.setItem('isLoggedIn', 'true');
		localStorage.setItem('Username', data.username);
		this.setActiveUsername(data.username);
		return Observable.of(true);
	}

	public logout(): void {
		localStorage.clear();
		this.setActiveUsername('');
	}


	public firebaseLogin(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword( data.username, data.password ).then(
				res => resolve(res),
				err => reject(err) )
		});


		
	}




}
