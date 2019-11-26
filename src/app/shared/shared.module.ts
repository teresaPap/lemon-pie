import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { NavComponent } from './components/nav/nav.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ProjectsService } from './data-services/projects.service';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { FilesService } from './data-services/files.service';
import { StorageService } from './services/storage.service';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';


@NgModule({
    declarations: [ 
		NavComponent, 
		DropzoneDirective, 
		FileUploaderComponent, 
		AddProjectComponent, 
		ButtonToggleComponent, 
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
		ButtonToggleComponent
    ],
    providers: [ 
		ProjectsService,
		FilesService,
		StorageService
    ]
})
export class SharedModule { }