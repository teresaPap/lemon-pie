import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { NavComponent } from './components/nav/nav.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { StorageService } from './services/storage.service';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';
import { StarBadgeComponent } from './components/star-badge/star-badge.component';
import { LemonPieLogoComponent } from './components/lemon-pie-logo/lemon-pie-logo.component';
import { AsideComponent } from './components/aside/aside.component';
import { EditorComponent } from './components/editor/editor.component';
import { PreviewEditorComponent } from './components/preview-editor/preview-editor.component';

@NgModule({
	declarations: [
		NavComponent,
		DropzoneDirective,
		ButtonToggleComponent,
		StarBadgeComponent,
		LemonPieLogoComponent,
		AsideComponent,
		EditorComponent,
		PreviewEditorComponent,
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
		ButtonToggleComponent,
		StarBadgeComponent,
		LemonPieLogoComponent,
		AsideComponent,
		EditorComponent,
		DropzoneDirective,
		PreviewEditorComponent,
	],
	providers: [
		StorageService
	]
})
export class SharedModule { }
