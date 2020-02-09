import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validators';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	public registerForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private notifier: NotifierService
	) { }

	ngOnInit() {

		this.registerForm = this.fb.group({
			email: ['', Validators.required],
			username: '',
			role: '',
			password: ['', Validators.required],
			confirmPassword: ['']
		},  { validator: CustomValidators.comparePasswords });

	}

	public register() {
		this.authService.register(this.registerForm.value).then(
			res => {
				console.log('Register successful!', res);
				this.notifier.notify('success', `Register successful!`);
				this.router.navigate(['/home']);
			},
			err => {
				this.notifier.notify('error', `${err.message}`);
				console.log('An error has occured', err);
			}
		);
	}

}
