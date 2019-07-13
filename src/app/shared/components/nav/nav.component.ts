import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../interfaces/IUser';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public currentUser: IUser ;
	public showBubbleMenu: boolean;

	constructor( private authService: AuthService ) { }

	ngOnInit() {
		this.currentUser = this.authService.getCurrentUser();

		this.authService.getAuthState().subscribe(
			(currentUser: IUser) => {
				this.currentUser = currentUser;
			}
		);
	}

	public logout(): void {
		this.authService.logout();
		this.toggleBubbleMenu();
	}
	
	public toggleBubbleMenu(): void {
		this.showBubbleMenu = !this.showBubbleMenu;
	}

	public logCurrentUser() {
		// NOTE: this is a test function
		let user = this.authService.getCurrentUser();
		console.log(user);
		this.authService.getAuthState();
	}
}
