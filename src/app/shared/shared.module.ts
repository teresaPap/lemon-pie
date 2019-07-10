import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { NavComponent } from './components/nav/nav.component';
import { FileUploadService } from './services/file-upload.service';
import { DropzoneDirective } from './directives/dropzone.directive';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';

@NgModule({
    declarations: [ 
		NavComponent, 
		DropzoneDirective, 
		FileUploaderComponent, 
		UploadTaskComponent, 
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
		FileUploaderComponent
    ],
    providers: [ 
        FileUploadService
    ]
})
export class SharedModule { }