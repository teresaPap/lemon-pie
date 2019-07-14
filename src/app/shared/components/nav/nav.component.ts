import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../interfaces/IUser';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	@Input() currentUser: IUser ;
	public showBubbleMenu: boolean;

	constructor( private authService: AuthService ) { }

	ngOnInit() {
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
		// this.authService.getAuthState().subscribe( 
		// 	res => console.log("dfsd", res),
		// 	err => console.log("errr", err)
		// );
	}
}
