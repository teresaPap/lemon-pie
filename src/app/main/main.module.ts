import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
	declarations: [
		HomeComponent,
		ProfileComponent,
		PageNotFoundComponent,
	],
	imports: [
		SharedModule,
		MainRoutingModule,
	]
})
export class MainModule { }
