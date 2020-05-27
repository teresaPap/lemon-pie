import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { ProjectComponent } from './project/project.component';
import { FlowPreviewComponent } from './project/flow-preview/flow-preview.component';
import { FlowEditComponent } from './project/flow-edit/flow-edit.component';
import { FilesListComponent } from './project/files-list/files-list.component';
import { FilesUploaderComponent } from './project/files-uploader/files-uploader.component';
import { ProjectDeleteFormComponent } from './project/project-delete-form/project-delete-form.component';
import { ProjectDetailsFormComponent } from './project/project-details-form/project-details-form.component';


const routes: Routes = [
	{
		path: ':id',
		component : ProjectComponent,
		children: [
			{ path: '', redirectTo: 'flow-preview', pathMatch: 'full' },
			{ path: 'flow-preview', component: FlowPreviewComponent },
			{ path: 'flow-edit', component: FlowEditComponent },
			{ path: 'files-inspect', component: FilesListComponent },
			{ path: 'files-add', component: FilesUploaderComponent },
			{ path: 'edit', component: ProjectDetailsFormComponent },
			{ path: 'delete', component: ProjectDeleteFormComponent },
		]
	},
	{ path: 'new', component: CreateProjectFormComponent },
	{ path: '', component : ProjectsListComponent },
];

@NgModule({
  	imports: [
		RouterModule.forChild(routes)
	]
})
export class ProjectsRoutingModule { }