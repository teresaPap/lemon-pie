import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../interfaces/IUser';


@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
})
export class NavComponent implements OnChanges {

	@Input() currentUserId: string|null ;
	public showBubbleMenu: boolean;

	constructor(
		private authService: AuthService,
		public router: Router) { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentUserId) {
			console.log('Current user changed: ', changes );
			this.currentUserId = changes.currentUserId.currentValue
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
