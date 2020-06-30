import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { AngularFireAuthGuardModule } from "@angular/fire/auth-guard";

@NgModule({
	declarations: [
		HomeComponent,
		ProfileComponent,
	],
	imports: [
		AngularFireAuthGuardModule,
		SharedModule,
		MainRoutingModule,
	]
})
export class MainModule { }
