import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

	constructor(
		private router: Router,
		private authService: AuthService  ) { }

	canActivate(): boolean {
		return this.checkLoggedIn();
	}

	canLoad(): boolean {
		return this.checkLoggedIn();
	}

	private checkLoggedIn(): boolean {
		if (this.authService.isLoggedIn()) {
			return true;
		}
		this.router.navigate(['/login']);
		return false;
	}

}
