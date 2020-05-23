import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectPresentComponent } from './project-present/project-present.component';


const routes: Routes = [
	{ path: 'new', component : ProjectCreateComponent },
	{ path: ':id/present', component : ProjectPresentComponent },
	{ path: ':id/edit', component : ProjectEditComponent },
	{ path: ':id', component : ProjectDetailsComponent },
	{ path: '', component : ProjectListComponent },
];

@NgModule({
  	imports: [
		RouterModule.forChild(routes)
	]
})
export class ProjectsRoutingModule { }
