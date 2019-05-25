import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	public loginForm: FormGroup;

	constructor( private fb: FormBuilder ) { }

	ngOnInit() {
		this.loginForm = this.fb.group({
			username: ['', Validators.required ],
			password: ['', Validators.required ]
		});
	}

	public login() {
		console.log('login');
	}

}
