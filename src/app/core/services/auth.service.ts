import { Injectable } from '@angular/core';
import { ILoginData } from '../../shared/interfaces/ILoginData';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Subject, Observable } from 'rxjs';
import { IUser } from '../../shared/interfaces/IUser';


@Injectable()
export class AuthService {

	public authStateSubject: Subject<IUser>;

	private setAuthState( user: IUser ): void { this.authStateSubject.next( user ) };
    
	public getAuthState(): Observable<IUser> { return this.authStateSubject.asObservable(); }
	

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
					this.authStateChanges();
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
					this.authStateChanges();
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

	public logout(): Promise<void> {
		console.log('TODO: log user out')
		return firebase.auth().signOut().then(
			() => this.authStateChanges()
		);
	}

	private authStateChanges() {
		firebase.auth().onAuthStateChanged( auth => {
			
			console.log("New Auth State is: " , auth);

			const {email, uid, refreshToken, emailVerified, isAnonymous} = auth;

			const user = {email, uid, refreshToken, emailVerified, isAnonymous };

			console.log("New user is: " ,  {email, uid, refreshToken, emailVerified, isAnonymous } );

			this.setAuthState( user );
		});
	}
	

}
