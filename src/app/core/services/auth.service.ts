import { Injectable } from '@angular/core';
import { ILoginData } from '../../shared/interfaces/ILoginData';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {

	constructor(
		public afAuth: AngularFireAuth) { }

	public isLoggedIn(): boolean {
		return !!localStorage.getItem('uid');
	}

	public login(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword( data.email, data.password ).then(
				res => {
					localStorage.setItem('uid', res.user.uid );
					resolve(res);
				},
				err => reject(err) )
		});
	}

	public register(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().createUserWithEmailAndPassword( data.email, data.password ).then(
				res => {
					localStorage.setItem('uid', res.user.uid );
					resolve(res);
				},
				err => reject(err) )
		});
	}

	public getCurrentUser() {
		if ( !firebase.auth().currentUser ) return 'No user is logged in at the moment'
		const  {email, uid} = firebase.auth().currentUser;
		return {email, uid};
	}

	public logout(): void {
		console.log('TODO: log user out')
		localStorage.clear();
		// this.setActiveUsername('');
	}

}
