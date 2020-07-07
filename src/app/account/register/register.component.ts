import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../core/services/auth.service';
import { CustomValidators } from '../../shared/custom-validators';
import { UsersService } from '../../shared/data-services/users.service';
import { IAuthData, IPersonalData } from '../../shared/interfaces/IUser';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

	public registerForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private usersCtrl: UsersService,
		private authService: AuthService,
		private router: Router,
		private notifier: NotifierService
	) { }

	ngOnInit() {

		this.registerForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			username: '',
			role: '',
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required]
		},  { validator: CustomValidators.comparePasswords });

	}

	public register() {
		const authData: IAuthData = {
			email: this.registerForm.controls['email'].value,
			password: this.registerForm.controls['password'].value,
		};
		const personalData: IPersonalData = {
			email: this.registerForm.controls['email'].value,
			username: (!!this.registerForm.controls['username'].value ? this.registerForm.controls['username'].value : this.registerForm.controls['email'].value ),
			role: this.registerForm.controls['role'].value,
		}

		this.usersCtrl.create(authData, personalData).subscribe(
			res => {
				this.notifier.notify('success', `Register successful!`);
				this.router.navigate(['/projects']);
			},
			err => {
				this.notifier.notify('error', `${err.message}`);
				console.log('An error has occured.', err);
			}
		);
	}

}
