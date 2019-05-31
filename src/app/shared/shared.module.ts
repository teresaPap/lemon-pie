import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { NavComponent } from './components/nav/nav.component';
import { FileUploadService } from './services/file-upload.service';

@NgModule({
    declarations: [ 
        NavComponent, 
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
    ],
    providers: [ 
        FileUploadService
    ]
})
export class SharedModule { }