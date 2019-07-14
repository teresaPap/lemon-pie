import { Injectable } from '@angular/core';
import { ILoginData } from '../../shared/interfaces/ILoginData';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Subject, Observable } from 'rxjs';
import { IUser } from '../../shared/interfaces/IUser';


@Injectable()
export class AuthService {

	private authStateSubject: Subject<IUser> = new Subject;
	private currentUser: IUser;

	constructor( public afAuth: AngularFireAuth) { 
		// detect auth state changes and push them in the subject
		afAuth.authState.subscribe( 
			change => {
				console.log("authState.change!", change)
				this.currentUser = this.parseUser(change);
				this.authStateSubject.next( this.currentUser )
			}
		)
	}

		
	public getAuthState(): Observable<IUser> { return this.authStateSubject.asObservable(); }

	public isLoggedIn(): boolean {
		// console.log("is logged in" , this.currentUser)
		return !!this.currentUser;
	}

	public login(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(
				res => {
					localStorage.setItem('uid', res.user.uid);
					resolve(res);
				},
				err => reject(err))
		});
	}

	public register(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then(
				res => {
					localStorage.setItem('uid', res.user.uid);
					resolve(res);
				},
				err => reject(err))
		});
	}

	public logout(): Promise<void> {
		console.log('TODO: log user out')
		return firebase.auth().signOut().then(
			() => console.log( "User is now logged out ")
		);
	}

	public getCurrentUser() {
		// const user = firebase.auth().currentUser;
		// console.log("user: ", user); 
		// if (!user) return null;
		return firebase.auth().currentUser;
	}

	private parseUser( fbUserdata ): IUser {
		if (!fbUserdata) return;
		const { email, uid, refreshToken, emailVerified, isAnonymous } = fbUserdata;
		const user = { email, uid, refreshToken, emailVerified, isAnonymous };
		return user;
	}

}
