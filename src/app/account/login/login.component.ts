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


	// TODO: trim email input
	// TODO: display user friendly error messages
	// TODO-css: make responsive
	public firebaseLogin() {
		this.authService.login(this.loginForm.value).then(
			res => {
				console.log('Login successful!', res);
				this.notifier.notify('success', `Login successful!`);
				this.router.navigate(['/home']);
			},
			err => {
				this.notifier.notify('error', `${err.message}`);
				console.log('An error has occured', err);
			}
		);
	}
}

