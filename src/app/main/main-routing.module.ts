import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { LibraryComponent } from './editor/library/library.component';
import { ProjectComponent } from './editor/project/project.component';


const routes : Routes = [
    { path: 'editor', component : LibraryComponent, canActivate: [AuthGuard] },
    { path: 'editor/:id', component : ProjectComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component : ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'home', component : HomeComponent },
	{ path: '', component : HomeComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class MainRoutingModule { }