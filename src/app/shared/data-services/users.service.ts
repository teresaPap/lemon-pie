import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { IUser, IAuthData, IPersonalData } from '../interfaces/IUser';


@Injectable({
	providedIn: 'root'
})
export class UsersService {

	constructor(
		private apiService: FirebaseApiService,
		private authService: AuthService
	) { }

	public create(authData: IAuthData, userdata: IPersonalData): Observable<any> {
		return this.authService.register({email: authData.email, password: authData.password, displayName: userdata.username}).pipe(
			switchMap( (user: IUser) =>
				this.apiService.createDocumentWithGivenId(userdata, user.id,'users')
			),
		);
	}

	public readCurrentUser(): Observable<IUser|null> {
		if ( this.authService.getCurrentUserId() === null ) {
			return null;
		}
		return this.apiService.readDocument( `users/${this.authService.getCurrentUserId()}` );
	}

	public updateCurrentUser(fields: any): Observable<void> {
		return this.apiService.updateDocument(`users/${this.authService.getCurrentUserId()}`, fields)
	}

	public updateCurrentUserPassword(newPassword: string): Observable<void> {
		return this.authService.updatePassword(newPassword);
	}

	public deleteCurrentUser(): Observable<any> {
		const currentUserId = this.authService.getCurrentUserId()
		return this.apiService.deleteDocument(`users/${currentUserId}`).pipe(
			switchMap( () => this.authService.deleteCurrentUser() ),
			catchError( err => {
				console.error('ERRORRR\n', err );
				return err;
			})
		);
	}

	public logout(): Observable<void> {
		return this.authService.logout();
	}


}
