import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../interfaces/IUser';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public currentUser: IUser ;
	public showBubbleMenu: boolean;

	constructor( 
		public router: Router, 
		private authService: AuthService ) { }

	ngOnInit() {
		console.log("Now listening to auth state changes");
		this.authService.getAuthState().subscribe(
			(currentUser: IUser) => {
				this.currentUser = currentUser;
			}
		);

	}

	public logout(): void {
		this.authService.logout().subscribe( () =>
			this.router.navigate(['/home'])
		);
		this.toggleBubbleMenu();
	}
	
	public toggleBubbleMenu(): void {
		this.showBubbleMenu = !this.showBubbleMenu;
	}

	public logCurrentUser() {
		// NOTE: this is a test function
		let user = this.authService.getCurrentUserId();
		console.log(user);
		// this.authService.getAuthState().subscribe( 
		// 	res => console.log("dfsd", res),
		// 	err => console.log("errr", err)
		// );
	}
}
