import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { IUser, IAuthData, IPersonalData } from '../interfaces/IUser';


@Injectable({
	providedIn: 'root'
})
export class UsersService {

	constructor(
		private apiService: FirebaseApiService,
		public firestore: AngularFirestore,
		private authService: AuthService
	) { }

	public create(authData: IAuthData, userdata: IPersonalData): Observable<any> {
		return this.authService.register({email: authData.email, password: authData.password}).pipe(
			switchMap( userCredentials =>
				this.apiService.createDocumentWithGivenId(userdata, userCredentials.user.uid,'users')
			),
		);
	}

	public readCurrentUser(): Observable<IUser|any> {
		return this.authService.getAuthState().pipe(
			tap( currentUser => console.log('This is the current user:', currentUser)),
			map( (currentUser: IUser) => {
				if ( !!currentUser && !!currentUser.id) {
					return currentUser.id;
				}
				throw Error('No user is logged in at the moment.');
			}),
			switchMap( (uid) => this.firestore.doc(`users/${uid}`).get() ),
			map((user) => user.data() ), // Read user data from given uid
			catchError( error => of(null) ) // Suppress error - this error occurs when no user has logged in
		);
	}

	public read(): Observable<IUser|any> {
		const uid = this.authService.getCurrentUserId();
		if (uid) {
			return this.firestore.doc(`users/${uid}`).get().pipe(
				map((user) => user.data() ), // Read user data from given uid
			);
		}
		return of(null);
	}


}
