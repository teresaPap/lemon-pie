import { NgModule } from '@angular/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { FileListItemComponent } from './project-detail/file-list-item/file-list-item.component';
import { ProjectPresentComponent } from './project-present/project-present.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';



@NgModule({
	declarations: [
		ProjectListComponent,
		ProjectDetailComponent,
	  	ProjectEditComponent,
	  	FileListItemComponent,
		ProjectPresentComponent,
		ProjectCreateComponent,
  	],
  	imports: [
  		SharedModule,
		ProjectsRoutingModule
  	]
})
export class ProjectsModule { }
