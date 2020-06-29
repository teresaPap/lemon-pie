import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
	{
		path: 'projects',
		canLoad: [AuthGuard],
		loadChildren: () =>
			import('./projects/projects.module').then( m => m.ProjectsModule )
	},
	{ path: 'profile', component : ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'home', component : HomeComponent },
	{ path: '', component : HomeComponent },
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	]
})
export class MainRoutingModule { }
