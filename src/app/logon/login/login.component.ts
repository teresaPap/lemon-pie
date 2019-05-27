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
		private router: Router ) { }

	ngOnInit() {
		this.loginForm = this.fb.group({
			username: ['', Validators.required ],
			password: ['', Validators.required ]
		});
	}

	public login() {
		console.log('login: ', this.loginForm.value);
		this.authService.login(this.loginForm.value).subscribe(
			(loginSuccess: boolean) => {
				if (loginSuccess) this.router.navigate(['']);
			}
			// TODO: handle login error
		);
	}

}
