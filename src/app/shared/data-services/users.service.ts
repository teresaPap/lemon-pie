import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import { IUser, IUserData } from '../interfaces/IUser';

import { Observable, of} from 'rxjs';
import { catchError, map, tap, switchMap} from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class UsersService {
	private uid: string;

	private r$: Observable<any>;
	private x$: Observable<any> = new Observable(null);

	constructor(
		public firestore: AngularFirestore,
		private authService: AuthService
	) { }

	public readCurrentUser(): Observable<IUserData|any> {
		return this.authService.getAuthState().pipe(
			tap( currentUser => console.log('This is the current user:', currentUser)),
			map( (currentUser: IUser) => {
				if ( !!currentUser && !!currentUser.uid) {
					return currentUser.uid;
				}
				throw Error('No user is logged in at the moment.');
			}),
			switchMap( (uid) => this.firestore.doc(`users/${uid}`).get() ),
			map((user) => user.data() ), // Read user data from given uid
			catchError( error => of(null) ) // Suppress error - this error occurs when no user has logged in
		);
	}

	public read(): Observable<IUserData|any> {
		const uid = this.authService.getCurrentUserId();
		if (uid) {
			return this.firestore.doc(`users/${uid}`).get().pipe(
				map((user) => user.data() ), // Read user data from given uid
			);
		}
		return of(null);
	}
}
