import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
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


	public firebaseLogin() {
		const loginCredentials = {
			email: this.loginForm.get('email').value.trim(),
			password: this.loginForm.get('password').value
		}
		this.authService.login(loginCredentials).then(
			res => {
				console.log('Login successful!', res);
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

