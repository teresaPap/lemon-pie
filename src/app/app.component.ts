import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	
	public isLoggedIn : boolean;
	title = 'lemon pie';

	constructor( private authSevice : AuthService ) {	}

	ngOnInit(): void {
		this.isLoggedIn = this.authSevice.isLoggedIn();
	}

}
