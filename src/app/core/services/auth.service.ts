import { Injectable } from '@angular/core';
import { ILoginData } from '../../shared/interfaces/ILoginData';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {

	// private subject = new Subject<string>();
	// public setActiveUsername(email: string): void { this.subject.next(email) };
	// public getActiveUsername(): Observable<string> { return this.subject.asObservable(); }

	constructor(
		public afAuth: AngularFireAuth) { }r


	public isLoggedIn(): boolean {
		return !!localStorage.getItem('uid');
	}

	public firebaseLogin(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword( data.email, data.password ).then(
				res => {
					localStorage.setItem('uid', res.user.uid );
					resolve(res);
				},
				err => reject(err) )
		});
	}

	public onAuthStateChanged() {
		console.log( "Current user: " , firebase.auth().currentUser );
	}

	public logout(): void {
		console.log('TODO: log user out')
		localStorage.clear();
		// this.setActiveUsername('');
	}




}
