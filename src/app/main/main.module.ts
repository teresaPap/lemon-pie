import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';

import { FileListItemComponent } from './projects/project-detail/file-list-item/file-list-item.component';
import { ProjectPresentComponent } from './projects/project-present/project-present.component';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';

@NgModule({
	declarations: [
		HomeComponent,
		ProfileComponent,
		ProjectListComponent,
		ProjectDetailComponent,
		ProjectEditComponent,
		FileListItemComponent,

		ProjectPresentComponent,
		ProjectCreateComponent,
	],
	imports: [
		SharedModule,
		MainRoutingModule
	]
})
export class MainModule { }
