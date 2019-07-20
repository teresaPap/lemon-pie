import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { AsideComponent } from './editor/aside/aside.component';
import { LibraryComponent } from './editor/library/library.component';

@NgModule({
    declarations: [
        HomeComponent,
		ProfileComponent,
		AsideComponent,
		LibraryComponent
    ],
    imports: [
		SharedModule,
		MainRoutingModule
    ]
})
export class MainModule { }