import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ProjectListComponent } from './editor/project-list/project-list.component';
import { ProjectDetailComponent } from './editor/project-detail/project-detail.component';
import { ProjectEditComponent } from './editor/project-edit/project-edit.component';


const routes : Routes = [
    { path: 'editor', component : ProjectListComponent, canActivate: [AuthGuard] },
    { path: 'editor/:id', component : ProjectDetailComponent, canActivate: [AuthGuard] },
    { path: 'editor/:id/edit', component : ProjectEditComponent, canActivate: [AuthGuard] },
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