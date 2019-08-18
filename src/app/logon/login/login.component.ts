import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

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
		private router: Router) { }

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
				console.log('Login success!', res);
				this.router.navigate(['/home']);
			},
			err => console.log('An error has occured', err)
		)
	}

	
	
}
