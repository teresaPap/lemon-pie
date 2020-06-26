import { Component, OnInit } from '@angular/core';
import { IUser } from './shared/interfaces/IUser';
import {AuthService} from "./core/services/auth.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	public currentUserId: string|null;

	constructor( private authService: AuthService ) { }

	ngOnInit(): void {
		this.authService.fireAuthStateChanges$.subscribe( (user:firebase.User) => {
			this.currentUserId = (user ? user.uid : null);
		})
	}

}
