import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public email: string;
	public showBubbleMenu: boolean;

	constructor( private authService: AuthService ) { }

	ngOnInit() {
		this.email = localStorage.getItem('uid');
		// this.authService.getActiveUsername().subscribe( email => this.email = email );
	}

	public logout(): void {
		this.authService.logout();
		this.toggleBubbleMenu();
	}
	
	public toggleBubbleMenu(): void {
		this.showBubbleMenu = !this.showBubbleMenu;
	}

	public currentUser() {
		// NOTE: this is a test function
		let user = this.authService.getCurrentUser();
		console.log(user);
	}
}
