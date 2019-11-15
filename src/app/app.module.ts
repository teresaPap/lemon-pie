import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './account/account.module';
import { MainModule } from './main/main.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		CommonModule, 
		HttpClientModule,

		// Firebase 
		AngularFireModule.initializeApp(environment.firebase), // initialize app
		AngularFirestoreModule, // firestore - imports firebase/firestore, only needed for database features
		AngularFireAuthModule, // auth - imports firebase/auth, only needed for auth features
		AngularFireStorageModule, // storage

		CoreModule,
		SharedModule,
		AccountModule,

		MainModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
