import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';


const routes: Routes = [
	{ path: 'new', component: CreateProjectFormComponent },
	{ path: ':id/flow-preview' },
	{ path: ':id/flow-edit' },
	{ path: ':id/files-inspect' },
	{ path: ':id/files-add' },
	{ path: ':id/edit' },
	{ path: ':id/delete' },
	{ path: ':id', component : ProjectDetailsComponent },
	{ path: '', component : ProjectsListComponent },
];

@NgModule({
  	imports: [
		RouterModule.forChild(routes)
	]
})
export class ProjectsRoutingModule { }
