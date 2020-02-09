import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IUserData} from '../../interfaces/IUser';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public currentUser: IUserData ;
	public showBubbleMenu: boolean;

	constructor(
		public router: Router,
		private authService: AuthService ) { }

	ngOnInit() {
		this.authService.getAuthState().subscribe(
			(currentUser: IUserData) => {
				this.currentUser = currentUser;
				this.currentUser.username = currentUser.username ? currentUser.username : currentUser.email;
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
		const user = this.authService.getCurrentUserId();
		console.log(user);
		// this.authService.getAuthState().subscribe(
		// 	res => console.log("dfsd", res),
		// 	err => console.log("errr", err)
		// );
	}

}
