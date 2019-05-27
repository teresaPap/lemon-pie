import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LogonModule } from './logon/logon.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './logon/login/login.component';
import { HomeComponent } from './main/home/home.component';
import { ProfileComponent } from './main/profile/profile.component';

const routes : Routes = [
	{ path: 'login', component : LoginComponent },
	{ path: 'profile', component : ProfileComponent },
	{ path: '', component : HomeComponent }
]

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ProfileComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		CommonModule, 
		HttpClientModule,
		RouterModule.forRoot(routes),
		CoreModule,
		SharedModule,
		LogonModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
