import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../core/services/auth.service';
import { IAuthData } from '../../shared/interfaces/IUser';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

	public loginForm: FormGroup;
	public loginFormErrorMessage: string;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private notifier: NotifierService
	) { }

	ngOnInit() {
		this.loginForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
	}


	public onLoginSubmitted(): void {
		const loginCredentials: IAuthData = {
			email: this.loginForm.get('email').value.trim(),
			password: this.loginForm.get('password').value
		};

		this.authService.login(loginCredentials).subscribe(
			res => {
				this.notifier.notify('default', `Login successful!`);
				this.router.navigate(['/home']);
			},
			err => {
				this.loginFormErrorMessage = err.message;
				this.loginForm.reset();
				console.log('An error has occurred', err);
			}
		);
	}
}

