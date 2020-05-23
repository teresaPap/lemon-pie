import { NgModule } from '@angular/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { FileListItemComponent } from './project-detail-DEPRECATED/file-list-item/file-list-item.component';
import { ProjectPresentComponent } from './project-present/project-present.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectDetailsComponent } from './project-details/project-details.component';



@NgModule({
	declarations: [
		ProjectListComponent,
	  	ProjectEditComponent,
	  	FileListItemComponent,
		ProjectPresentComponent,
		ProjectCreateComponent,
		ProjectDetailsComponent,
  	],
  	imports: [
  		SharedModule,
		ProjectsRoutingModule
  	]
})
export class ProjectsModule { }
