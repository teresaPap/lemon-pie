import { NgModule } from "@angular/core";
import { NavAsideComponent } from './components/nav-aside/nav-aside.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ 
        NavTopComponent, 
        NavAsideComponent
    ],
    imports: [ 
        CommonModule
    ],
    exports: [ 
        NavTopComponent,
        NavAsideComponent
    ],
    providers: [ ]
})
export class SharedModule { }