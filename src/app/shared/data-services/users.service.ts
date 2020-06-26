import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
		return this.authService.register({email: authData.email, password: authData.password}).pipe(
			switchMap( userCredentials =>
				this.apiService.createDocumentWithGivenId(userdata, userCredentials.user.uid,'users')
			),
		);
	}

	public readCurrentUser(): Observable<IUser|null> {
		if ( this.authService.getCurrentUserId() === null ) {
			return null;
		}
		return this.apiService.readDocument( `users/${this.authService.getCurrentUserId()}` );
	}



}
