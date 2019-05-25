import { NgModule } from "@angular/core";
import { NavAsideComponent } from './components/nav-aside/nav-aside.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';

@NgModule({
    declarations: [ 
        NavTopComponent, 
        NavAsideComponent
    ],
    imports: [ 
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        CoreModule
    ],
    exports: [
        RouterModule,
        ReactiveFormsModule, 
        NavTopComponent,
        NavAsideComponent,
    ],
    providers: [ ]
})
export class SharedModule { }