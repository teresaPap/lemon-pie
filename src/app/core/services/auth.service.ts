import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IAuthData } from '../../shared/interfaces/IUser';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	public fireAuthStateChanges$: Observable<firebase.User> = this.afAuth.authState;

	constructor(
		public afAuth: AngularFireAuth,
	) {	}

	public isLoggedIn(): boolean {
		return !!this.afAuth.idToken;
	}

	public login(data: IAuthData): Observable<firebase.auth.UserCredential> {
		return from(this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password));
	}

	public register(data: IAuthData): Observable<firebase.auth.UserCredential> {
		return from(this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password));
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
