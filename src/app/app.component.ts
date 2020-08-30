import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	public currentUser: string|null;

	constructor( private authService: AuthService ) { }

	ngOnInit(): void {
		this.authService.fireAuthStateChanges$.subscribe( (user:firebase.UserInfo) => {
			// console.log(user);
			this.currentUser = (user ? (user.displayName? user.displayName : user.email) : null);
		})
	}

}
