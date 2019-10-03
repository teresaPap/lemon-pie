import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { NavComponent } from './components/nav/nav.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { ProjectsService } from './data-services/projects.service';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { FilesService } from './data-services/files.service';
import { StorageService } from './services/storage.service';
import { EditorComponent } from './components/editor/editor.component';
import { SelectionMenuComponent } from './components/selection-menu/selection-menu.component';
import { LinkerComponent } from './components/linker/linker.component';

@NgModule({
    declarations: [ 
		NavComponent, 
		DropzoneDirective, 
		FileUploaderComponent, 
		UploadTaskComponent, 
		AddProjectComponent, 
		EditorComponent, 
		SelectionMenuComponent, 
		LinkerComponent, 
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
		EditorComponent,
		SelectionMenuComponent,
		LinkerComponent,
    ],
    providers: [ 
		ProjectsService,
		FilesService,
		StorageService
    ]
})
export class SharedModule { }