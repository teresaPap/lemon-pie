import { Component, OnInit } from '@angular/core';
import { IUser } from './shared/interfaces/IUser';
import {AuthService} from "./core/services/auth.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	public currentUser: IUser;

	constructor( private authService: AuthService ) { }

	ngOnInit(): void {
		this.authService.fireAuthStateChanges$.subscribe( res => {
			console.log(res);
			this.currentUser = this.authService.parseUser(res);
		})
	}

}
