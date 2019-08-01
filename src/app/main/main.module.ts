import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { AsideComponent } from './editor/aside/aside.component';
import { ProjectDetailComponent } from './editor/project-detail/project-detail.component';
import { ProjectListComponent } from './editor/project-list/project-list.component';
import { ProjectEditComponent } from './editor/project-edit/project-edit.component';

@NgModule({
    declarations: [
        HomeComponent,
		ProfileComponent,
		AsideComponent,
		ProjectListComponent,
		ProjectDetailComponent,
		ProjectEditComponent
    ],
    imports: [
		SharedModule,
		MainRoutingModule
    ]
})
export class MainModule { }