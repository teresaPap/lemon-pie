import { Injectable } from '@angular/core';
import { ILoginData } from '../../shared/interfaces/ILoginData';

import { AngularFireAuth } from '@angular/fire/auth';
import { Subject, Observable, from } from 'rxjs';
import { IUser } from '../../shared/interfaces/IUser';
import {NotifierService} from 'angular-notifier';


@Injectable()
export class AuthService {

	private authStateSubject: Subject<IUser> = new Subject;
	private currentUser: IUser;

	private static parseUser( fbUserdata ): IUser {
		if (!fbUserdata) {
			return;
		}
		const { email, uid, refreshToken, emailVerified, isAnonymous } = fbUserdata;
		return { email, uid, refreshToken, emailVerified, isAnonymous };
	}

	constructor(
		public afAuth: AngularFireAuth,
		private notifier: NotifierService
	) {
		// detect auth state changes and push them in the subject
		afAuth.authState.subscribe(
			change => {
				this.currentUser = AuthService.parseUser(change);
				this.authStateSubject.next( this.currentUser );
			}
		);
	}

	public getAuthState(): Observable<IUser> { return this.authStateSubject.asObservable(); }

	public isLoggedIn(): boolean {
		return !!this.currentUser;
	}

	public login(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password).then(
				res => {
					localStorage.setItem('uid', res.user.uid);
					resolve(res);
				},
				err => reject(err)
			);
		});
	}

	public register(data: ILoginData) {
		return new Promise<any>((resolve, reject) => {
			this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password).then(
				res => {
					localStorage.setItem('uid', res.user.uid);
					resolve(res);
				},
				err => reject(err)
			);
		});
	}

	public logout():  Observable<void> {
		console.log('Logging user out...');
		const action = this.afAuth.auth.signOut().then(
			() => {
				console.log( 'Logout successful!');
				this.notifier.notify('default', `Logout successful!`);
			}
		).catch( error => {
			this.notifier.notify('error', `${error.message}`);
			throw console.warn('logging out error: ', error );
		});

		return from(action);
	}

	public getCurrentUserId(): string {
		const user = this.afAuth.auth.currentUser;
		if (user) {
			return user.uid;
		}
		return '';
	}


}
