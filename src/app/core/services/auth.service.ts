import { Injectable } from '@angular/core';
import { ILoginData } from '../../shared/interfaces/ILoginData';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Subject, Observable } from 'rxjs';
import { IUser } from '../../shared/interfaces/IUser';


@Injectable()
export class AuthService {

	public authStateSubject: Subject<IUser> = new Subject;
	private currentUser: IUser;

	constructor(
		public afAuth: AngularFireAuth) { }

		
	public getAuthState(): Observable<IUser> { return this.authStateSubject.asObservable(); }

	public setAuthState(): void {
		firebase.auth().onAuthStateChanged( 
			auth => {
				console.log("New Auth State is: ", auth);
				this.currentUser = this.parseUser(auth);
				this.authStateSubject.next( this.currentUser )
		});
	}

	public isLoggedIn(): boolean {
		return !!this.currentUser;
	}

	public login(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(
				res => {
					localStorage.setItem('uid', res.user.uid);
					this.setAuthState();
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
					this.setAuthState();
					resolve(res);
				},
				err => reject(err))
		});
	}

	public logout(): Promise<void> {
		console.log('TODO: log user out')
		return firebase.auth().signOut().then(
			() => this.setAuthState()
		);
	}

	public getCurrentUser(): IUser {
		const user = firebase.auth().currentUser;
		console.log("user: ", user); 
		if (!user) return null;
		return this.parseUser( user );
	}

	private parseUser( fbUserdata ): IUser {
		const { email, uid, refreshToken, emailVerified, isAnonymous } = fbUserdata;
		const user = { email, uid, refreshToken, emailVerified, isAnonymous };
		return user;
	}

}
