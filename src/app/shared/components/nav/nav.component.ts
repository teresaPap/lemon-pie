import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IUser } from '../../interfaces/IUser';
import { Router } from '@angular/router';
import { AuthService } from "../../../core/services/auth.service";

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnChanges {

	@Input() currentUser: IUser ;
	public showBubbleMenu: boolean;

	constructor(
		private authService: AuthService,
		public router: Router) { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentUser) {
			this.currentUser = changes.currentUser.currentValue
		}
	}

	public logout(): void {
		// TODO: remove logout action from navbar component
		this.authService.logout().subscribe( () =>
			this.router.navigate(['/home'])
		);
		this.toggleBubbleMenu();
	}

	public toggleBubbleMenu(): void {
		this.showBubbleMenu = !this.showBubbleMenu;
	}

}
