import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	public registerForm: FormGroup; 

	constructor( 
		private fb : FormBuilder,
		private authService: AuthService ) { }

	ngOnInit() {

		this.registerForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
			confirmPassword: ['']
		},  { validator: CustomValidators.comparePasswords });

	}

	public register() {
		this.authService.register(this.registerForm.value).then(
			res => {
				console.log('Register success!', res);
			},
			err => console.log('An error has occured', err)
		);
	}

}
