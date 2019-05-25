import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	public username: string;

	constructor( private authService: AuthService ) { }

	ngOnInit() {
		// TODO: get user info from auth service and set username variable
		this.username = this.authService.getUsername();
	}

}
