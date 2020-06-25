import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject, Observable, from } from 'rxjs';
import { IUser, IAuthData } from '../../shared/interfaces/IUser';
import { NotifierService } from 'angular-notifier';


@Injectable()
export class AuthService {

	private authStateSubject: Subject<IUser> = new Subject;
	private currentUser: IUser;

	private static parseUser( fbUserdata ): IUser {
		if (!fbUserdata) {
			return;
		}
		const { email, username, id, refreshToken, emailVerified, isAnonymous } = fbUserdata;
		return { email, username, id, refreshToken, emailVerified, isAnonymous };
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

	public login(data: IAuthData): Observable<any> {
		return from(this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password));
	}

	public register(data: IAuthData): Observable<any> {
		return from(this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password));
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
