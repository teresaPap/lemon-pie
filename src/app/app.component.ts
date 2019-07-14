import { Component, OnInit } from '@angular/core';
import { IUser } from './shared/interfaces/IUser';
import { AuthService } from './core/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	
	public currentUser: IUser;

	constructor( private authService: AuthService ) {	}

	ngOnInit(): void {
		// this.currentUser = this.authService.getCurrentUser();
		// console.log("ajsdjkah" , this.currentUser)

		console.log("Now listening to auth state changes");
		this.authService.getAuthState().subscribe(
			(currentUser: IUser) => {
				this.currentUser = currentUser;
			}
		);

	}

}
