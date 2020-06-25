import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CustomValidators } from '../../shared/custom-validators';
import { AuthService } from '../../core/services/auth.service';
import {UsersService} from "../../shared/data-services/users.service";
import {IAuthData, IPersonalData, IUser} from "../../shared/interfaces/IUser";

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
			email: ['', Validators.required],
			username: '',
			role: '',
			password: ['', Validators.required],
			confirmPassword: ['']
		},  { validator: CustomValidators.comparePasswords });

	}

	public register() {
		console.log('FORM VALUE', this.registerForm.value);

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
				console.log('Register successful!', res);
				this.notifier.notify('success', `Register successful!`);
				this.router.navigate(['/home']);
			},
			err => {
				this.notifier.notify('error', `${err.message}`);
				console.log('An error has occured.', err);
			}
		);
	}

}
