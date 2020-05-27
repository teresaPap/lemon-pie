import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectComponent } from './project/project.component';
import { FlowPreviewComponent } from './project/flow-preview/flow-preview.component';
import { FlowEditComponent } from './project/flow-edit/flow-edit.component';
import { ProjectDetailsFormComponent } from './project/project-details-form/project-details-form.component';
import { ProjectDeleteFormComponent } from './project/project-delete-form/project-delete-form.component';
import { FilesListComponent } from './project/files-list/files-list.component';
import { FilesUploaderComponent } from './project/files-uploader/files-uploader.component';



@NgModule({
	declarations: [
		ProjectsListComponent,
		CreateProjectFormComponent,
		ProjectComponent,
		FlowPreviewComponent,
		FlowEditComponent,
		ProjectDetailsFormComponent,
		ProjectDeleteFormComponent,
		FilesListComponent,
		FilesUploaderComponent,
  	],
  	imports: [
  		SharedModule,
		ProjectsRoutingModule
  	]
})
export class ProjectsModule { }
