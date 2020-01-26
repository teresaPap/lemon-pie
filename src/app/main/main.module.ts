import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { AsideComponent } from './projects/project-edit/aside/aside.component';
import { EditorComponent } from './projects/project-edit/editor/editor.component';
import { SelectionMenuComponent } from './projects/project-edit/selection-menu/selection-menu.component';
import { LinkerComponent } from './projects/project-edit/linker/linker.component';
import { FileListItemComponent } from './projects/project-detail/file-list-item/file-list-item.component';
import { ProjectPresentComponent } from './projects/project-present/project-present.component';

@NgModule({
	declarations: [
		HomeComponent,
		ProfileComponent,
		AsideComponent,
		ProjectListComponent,
		ProjectDetailComponent,
		ProjectEditComponent,
		FileListItemComponent,

		EditorComponent,
		SelectionMenuComponent,
		LinkerComponent,
		ProjectPresentComponent,
	],
	imports: [
		SharedModule,
		MainRoutingModule
	]
})
export class MainModule { }
