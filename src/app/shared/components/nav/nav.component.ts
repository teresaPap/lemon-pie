import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public username: string;
	public showBubbleMenu: boolean;

	constructor( private authService: AuthService ) { }

	ngOnInit() {
		this.username = localStorage.getItem('Username');
		this.authService.getActiveUsername().subscribe( username => this.username = username );
	}

	public logout(): void {
		this.authService.logout();
		this.toggleBubbleMenu();
	}
	
	public toggleBubbleMenu(): void {
		this.showBubbleMenu = !this.showBubbleMenu;
	}
}
