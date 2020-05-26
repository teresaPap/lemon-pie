import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { FileListItemComponent } from './project-detail-DEPRECATED/file-list-item/file-list-item.component';
import { ProjectPresentComponent } from './project-present/project-present.component';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectDetailsComponent } from './project-details/project-details.component';



@NgModule({
	declarations: [
		ProjectsListComponent,
	  	ProjectEditComponent,
	  	FileListItemComponent,
		ProjectPresentComponent,
		CreateProjectFormComponent,
		ProjectDetailsComponent,
  	],
  	imports: [
  		SharedModule,
		ProjectsRoutingModule
  	]
})
export class ProjectsModule { }
