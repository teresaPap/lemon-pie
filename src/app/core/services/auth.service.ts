import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, UserInfo } from 'firebase/app';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IAuthData, IUser } from '../../shared/interfaces/IUser';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	public fireAuthStateChanges$: Observable<UserInfo|null> = this.afAuth.authState.pipe(
		map((user: User) => {
			if (!user) {
				return null;
			}
			const { displayName, email, phoneNumber, photoURL, providerId, uid }: UserInfo = user;
			return { displayName, email, phoneNumber, photoURL, providerId, uid };
		})
	);

	constructor(
		public afAuth: AngularFireAuth,
	) {	}

	public isLoggedIn(): boolean {
		return !!this.afAuth.idToken;
	}

	public login(data: IAuthData): Observable<firebase.auth.UserCredential> {
		return from(this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password));
	}

	public register(data: IAuthData): Observable<IUser> {
		return from(this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)).pipe(
			switchMap( () => this.afAuth.auth.currentUser.updateProfile({displayName: data.displayName})),
			map( () => {
				return {
					id: this.afAuth.auth.currentUser.uid,
					email: this.afAuth.auth.currentUser.email,
					username: this.afAuth.auth.currentUser.displayName
				}
			})
		);
	}

	public logout():  Observable<void> {
		return from(this.afAuth.auth.signOut());
	}

	public getCurrentUserId(): string|null {
		return (this.afAuth.auth.currentUser ? this.afAuth.auth.currentUser.uid : null);
	}

	public deleteCurrentUser(): Observable<void> {
		return from(this.afAuth.auth.currentUser.delete()).pipe(
			switchMap(() => this.logout() )
		);
	}

	public updatePassword(newPassword: string): Observable<void> {
		return from(this.afAuth.auth.currentUser.updatePassword(newPassword));
	}

}
