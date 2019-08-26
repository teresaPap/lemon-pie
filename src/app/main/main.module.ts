import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { AsideComponent } from './projects/aside/aside.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { FileListItemComponent } from './files/file-list-item/file-list-item.component';

@NgModule({
    declarations: [
        HomeComponent,
		ProfileComponent,
		AsideComponent,
		ProjectListComponent,
		ProjectDetailComponent,
		ProjectEditComponent,
		FileListItemComponent
    ],
    imports: [
		SharedModule,
		MainRoutingModule
    ]
})
export class MainModule { }