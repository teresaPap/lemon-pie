import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { NavComponent } from './components/nav/nav.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { StorageService } from './services/storage.service';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';
import { StarBadgeComponent } from './components/star-badge/star-badge.component';
import { LemonPieLogoComponent } from './components/lemon-pie-logo/lemon-pie-logo.component';
import {AsideComponent} from "./components/aside/aside.component";
import {EditorComponent} from "./components/editor/editor.component";
import {SelectionMenuComponent} from "./components/selection-menu/selection-menu.component";

@NgModule({
	declarations: [
		NavComponent,
		DropzoneDirective,
		FileUploaderComponent,
		AddProjectComponent,
		ButtonToggleComponent,
		StarBadgeComponent,
		LemonPieLogoComponent,
		AsideComponent,
		EditorComponent,
		SelectionMenuComponent,
	],
	imports: [
		RouterModule,
		CommonModule,
		ReactiveFormsModule,
		CoreModule
	],
	exports: [
		RouterModule,
		CommonModule,
		ReactiveFormsModule,
		NavComponent,
		FileUploaderComponent,
		AddProjectComponent,
		ButtonToggleComponent,
		StarBadgeComponent,
		LemonPieLogoComponent,
		AsideComponent,
		EditorComponent,
		SelectionMenuComponent,
		DropzoneDirective,
	],
	providers: [
		StorageService
	]
})
export class SharedModule { }
