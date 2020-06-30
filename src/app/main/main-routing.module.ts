import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['/home']);

const routes: Routes = [
	{
		path: 'projects',
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToHome },
		loadChildren: () =>
			import('./projects/projects.module').then( m => m.ProjectsModule )
	},
	{
		path: 'profile',
		component : ProfileComponent,
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToHome },
	},
	{ path: 'home', component : HomeComponent },
	{ path: '', component : HomeComponent },
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	]
})
export class MainRoutingModule { }
