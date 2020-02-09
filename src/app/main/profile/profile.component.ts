import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../shared/data-services/users.service';
import { IUser, IUserData } from '../../shared/interfaces/IUser';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

	public currentUser: IUserData;

	constructor( private userCtrl: UsersService ) { }

	ngOnInit() {
		this.userCtrl.readCurrentUser().subscribe(
			(currentUser: IUser) => {
				this.currentUser = currentUser;
				console.log('currentUser:', currentUser);
			}
		);

		this.userCtrl.read().subscribe(
			(currentUser: IUserData) => {
				this.currentUser = currentUser;
				console.log('currentUser:', currentUser);
			}
		);
	}
}
