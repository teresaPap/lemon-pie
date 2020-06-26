import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject, Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IUser, IAuthData } from '../../shared/interfaces/IUser';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private currentUser: IUser;
	private authStateSource: Subject<IUser|null> = new Subject<IUser|null>();

	public authStateChanges$ = this.authStateSource.asObservable();
	public fireAuthStateChanges$ = this.afAuth.authState;

	constructor(
		public afAuth: AngularFireAuth,
	) {

		afAuth.authState.subscribe(res => {
			// console.log('afAuth.authState: ', res)
		});

		this.authStateChanges$.subscribe( res => {
			// console.log('authStateChanges$: ', res )
		});
	}

	private changeAuthState(currentUser: IUser|null): void {
		this.authStateSource.next(currentUser)
	}

	public isLoggedIn(): boolean {
		return !!this.currentUser;
	}

	public login(data: IAuthData): Observable<firebase.auth.UserCredential> {
		return from(this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password)).pipe(
			tap( userCredentials => {
				this.changeAuthState(this.parseUser(userCredentials))
			})
		);
	}

	public register(data: IAuthData): Observable<firebase.auth.UserCredential> {
		return from(this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)).pipe(
			tap( userCredentials => {
				this.changeAuthState(this.parseUser(userCredentials))
			})
		);
	}

	public logout():  Observable<void> {
		return from(this.afAuth.auth.signOut()).pipe(
			tap( () => this.changeAuthState(null))
		);
	}

	public getCurrentUserId(): string {
		const user = this.afAuth.auth.currentUser;
		if (user) {
			return user.uid;
		}
		return '';
	}


	public parseUser( fbUserdata: firebase.User ): IUser {
		if (!fbUserdata) {
			return;
		}
		const user: IUser = {
			id: fbUserdata.uid,
			email: fbUserdata.email,
		}

		return user;
	}

}
